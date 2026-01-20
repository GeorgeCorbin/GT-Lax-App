#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

const BASE_URL = 'https://www.gtlacrosse.com';
const ROSTER_URL = `${BASE_URL}/sports/mlax/2025-26/roster?view=list`;
const OUTPUT_DIR = path.join(__dirname, '../firebase/public/players');
const BIOS_DIR = path.join(OUTPUT_DIR, 'bios');

class RosterScraper {
  constructor() {
    this.players = [];
    this.errors = [];
  }

  async init() {
    console.log('🚀 Starting GT Lacrosse Roster Scraper...\n');
    
    // Create output directories
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.mkdir(BIOS_DIR, { recursive: true });
  }

  async fetchPage(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching ${url}:`, error.message);
      throw error;
    }
  }

  async scrapeRosterList() {
    console.log('📋 Fetching roster list...');
    const html = await this.fetchPage(ROSTER_URL);
    const $ = cheerio.load(html);
    
    const players = [];
    
    // The roster is in a table within .roster-data or .table-responsive
    // Each player is a row in tbody
    $('tbody tr').each((i, row) => {
      const $row = $(row);
      
      // Find the player link - it contains the bio URL and name
      const playerLink = $row.find('a[href*="/bios/"]');
      if (playerLink.length === 0) return;
      
      const bioUrl = playerLink.attr('href');
      const fullName = playerLink.text().trim().replace(/\s+/g, ' ');
      
      if (!fullName || !bioUrl) return;
      
      // Extract jersey number from the badge or first td
      let number = null;
      const badgeSpan = $row.find('.badge');
      if (badgeSpan.length > 0) {
        number = parseInt(badgeSpan.text().trim());
      } else {
        // Try first td with jersey-number class
        const jerseyTd = $row.find('td.jersey-number, td:first-child');
        const numText = jerseyTd.text().trim();
        if (/^\d+$/.test(numText)) {
          number = parseInt(numText);
        }
      }
      
      const playerData = {
        playerName: fullName,
        bioSlug: bioUrl.split('/').pop(),
        bioUrl: bioUrl.startsWith('http') ? bioUrl : `${BASE_URL}${bioUrl}`,
        number: number,
      };
      
      // Extract data from table cells
      // Table structure: #, Name, Pos, Cl, Ht, Wt, Hometown/High School, State
      const cells = $row.find('td');
      cells.each((j, cell) => {
        const text = $(cell).text().trim();
        // Skip empty cells and the name cell (already extracted)
        if (!text || $(cell).find('a[href*="/bios/"]').length > 0) return;
      });
      
      players.push(playerData);
    });
    
    console.log(`✅ Found ${players.length} players\n`);
    return players;
  }

  async scrapeBioPage(player) {
    console.log(`  📖 Scraping bio for ${player.playerName}...`);
    
    try {
      const html = await this.fetchPage(player.bioUrl);
      const $ = cheerio.load(html);
      
      // Extract additional details from bio page
      const details = {};
      
      // Get jersey number from .player-heading .number
      const numberSpan = $('.player-heading .number');
      if (numberSpan.length > 0) {
        const numText = numberSpan.text().trim();
        if (/^\d+$/.test(numText)) {
          details.number = parseInt(numText);
        }
      }
      
      // Get player details from list items anywhere on the page
      $('li').each((i, li) => {
        const text = $(li).text().trim();
        if (text.length > 100) return;
        
        if (text.includes('Height:')) {
          details.height = text.split('Height:')[1]?.trim();
        } else if (text.includes('Weight:')) {
          details.weight = text.split('Weight:')[1]?.trim();
        } else if (text.includes('Position:')) {
          details.position = text.split('Position:')[1]?.trim();
        } else if (text.includes('Year:')) {
          details.year = text.split('Year:')[1]?.trim();
        } else if (text.includes('Hometown:')) {
          details.hometown = text.split('Hometown:')[1]?.trim();
        } else if (text.includes('State:')) {
          details.state = text.split('State:')[1]?.trim();
        } else if (text.includes('High School:')) {
          details.highSchool = text.split('High School:')[1]?.trim();
        }
      });
      
      // Get headshot image URL (use website URL directly, don't download)
      let headshotUrl = null;
      $('img').each((i, img) => {
        const src = $(img).attr('src') || '';
        if (src.includes('/sports/mlax/') && src.includes('/bios/') && 
            !src.includes('logo') && !src.includes('favicon') && !src.includes('thumbnail')) {
          headshotUrl = src;
          return false;
        }
      });
      
      if (!headshotUrl) {
        const bioImage = $('.bio-image img, .player-image img, .bio-wrap img').first();
        if (bioImage.length > 0) {
          headshotUrl = bioImage.attr('src') || bioImage.attr('data-src');
        }
      }
      
      if (headshotUrl && !headshotUrl.startsWith('http')) {
        headshotUrl = `${BASE_URL}${headshotUrl}`;
      }
      if (headshotUrl) {
        details.headshotUrl = headshotUrl;
      }
      
      // Extract Honors and Achievements from #bio tab panel
      const achievements = [];
      const bioPanel = $('#bio');
      if (bioPanel.length > 0) {
        bioPanel.find('p, li, div').each((i, elem) => {
          const text = $(elem).text().trim();
          if (text && text.length > 5 && text.length < 200 && 
              !text.includes('Privacy') && !text.includes('Terms') &&
              !text.toLowerCase().includes('bio')) {
            // Check if it looks like an achievement
            if (text.includes('SELC') || text.includes('All ') || text.includes('Captain') || 
                text.includes('Scholar') || text.includes('Team') || text.includes('Award') ||
                text.includes('Honorable') || text.includes('MCLA') || /^\d{4}/.test(text)) {
              if (!achievements.includes(text)) {
                achievements.push(text);
              }
            }
          }
        });
      }
      details.achievements = achievements;
      
      // Extract Career Stats from #career tab panel
      const careerStats = { headers: [], rows: [] };
      const careerPanel = $('#career');
      if (careerPanel.length > 0) {
        const table = careerPanel.find('table').first();
        if (table.length > 0) {
          // Get headers
          table.find('thead tr th').each((i, th) => {
            const header = $(th).text().trim();
            careerStats.headers.push(header || 'Year');
          });
          
          // Get rows
          table.find('tbody tr').each((i, tr) => {
            const row = [];
            $(tr).find('td, th').each((j, td) => {
              row.push($(td).text().trim());
            });
            if (row.length > 0) {
              careerStats.rows.push(row);
            }
          });
        }
      }
      details.careerStats = careerStats;
      
      return { details };
      
    } catch (error) {
      console.error(`  ❌ Error scraping bio for ${player.playerName}:`, error.message);
      this.errors.push({ player: player.playerName, error: error.message });
      return { details: {} };
    }
  }

  generateBioMarkdown(player) {
    let md = '';
    
    // Player Details section
    md += '## Player Details\n\n';
    if (player.height) md += `- **Height:** ${player.height}\n`;
    if (player.weight) md += `- **Weight:** ${player.weight}\n`;
    if (player.hometown) md += `- **Hometown:** ${player.hometown}\n`;
    if (player.position) md += `- **Position:** ${player.position}\n`;
    if (player.year) md += `- **Year:** ${player.year}\n`;
    if (player.state) md += `- **State:** ${player.state}\n`;
    if (player.highSchool) md += `- **High School:** ${player.highSchool}\n`;
    md += '\n';
    
    // Honors and Achievements section - only include if there are achievements
    if (player.achievements && player.achievements.length > 0) {
      md += '## Honors and Achievements\n\n';
      player.achievements.forEach(achievement => {
        md += `- ${achievement}\n`;
      });
      md += '\n';
    }
    
    // Career Stats section
    md += '## Career Stats\n\n';
    if (player.careerStats && player.careerStats.headers.length > 0 && player.careerStats.rows.length > 0) {
      // Filter out unwanted columns: up, dn, to, ct, sog, sog%
      const excludeColumns = ['up', 'dn', 'to', 'ct', 'sog', 'sog%'];
      const headers = player.careerStats.headers;
      const filteredIndices = [];
      const filteredHeaders = [];
      
      headers.forEach((header, index) => {
        const lowerHeader = header.toLowerCase();
        if (!excludeColumns.includes(lowerHeader)) {
          filteredIndices.push(index);
          filteredHeaders.push(header);
        }
      });
      
      // Create markdown table with filtered columns
      md += '| ' + filteredHeaders.join(' | ') + ' |\n';
      md += '| ' + filteredHeaders.map(() => '---').join(' | ') + ' |\n';
      
      player.careerStats.rows.forEach(row => {
        const filteredRow = filteredIndices.map(i => row[i]);
        md += '| ' + filteredRow.join(' | ') + ' |\n';
      });
    } else {
      md += 'No career stats available.\n';
    }
    
    return md;
  }

  getBioFilename(playerName) {
    // Convert "First Last" to "First_Last_bio.md"
    const parts = playerName.split(' ');
    const formatted = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('_');
    return `${formatted}_bio.md`;
  }

  async processPlayers(players) {
    console.log('🔄 Processing player details...\n');
    
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      console.log(`[${i + 1}/${players.length}] Processing ${player.playerName}...`);
      
      // Scrape bio page for additional details
      const { details } = await this.scrapeBioPage(player);
      
      // Merge details
      const originalNumber = player.number;
      Object.assign(player, details);
      if (!player.number && originalNumber) {
        player.number = originalNumber;
      }
      
      // Use website image URL directly (no downloading)
      if (player.headshotUrl) {
        player.imageUrl = player.headshotUrl;
        console.log(`  ✅ Using website image URL`);
      } else {
        console.log(`  ⚠️  No headshot URL found, using default`);
        player.imageUrl = 'https://gt-lax-app.web.app/players/images/headshot_default.png';
      }
      
      // Generate and save bio markdown file
      const bioFilename = this.getBioFilename(player.playerName);
      const bioPath = path.join(BIOS_DIR, bioFilename);
      const bioContent = this.generateBioMarkdown(player);
      await fs.writeFile(bioPath, bioContent, 'utf8');
      player.contentUrl = `https://gt-lax-app.web.app/players/bios/${bioFilename}`;
      console.log(`  ✅ Saved bio: ${bioFilename}\n`);
      
      // Add small delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return players;
  }

  normalizePosition(position) {
    if (!position) return '';
    
    const posMap = {
      'Defense': 'D',
      'Attack': 'A',
      'Midfield': 'M',
      'Goalie': 'G',
      'Face-Off': 'FO',
      'LSM': 'LSM'
    };
    
    return posMap[position] || position;
  }

  async generateOutputFiles(players) {
    console.log('📝 Generating output files...\n');
    
    // Filter out unwanted columns from career stats: up, dn, to, ct, sog, sog%
    const excludeColumns = ['up', 'dn', 'to', 'ct', 'sog', 'sog%'];
    
    // Generate players.json with all player data for programmatic display
    const jsonPlayers = players.map((p, index) => {
      // Filter career stats columns
      let filteredCareerStats = null;
      if (p.careerStats && p.careerStats.headers.length > 0) {
        const filteredIndices = [];
        const filteredHeaders = [];
        
        p.careerStats.headers.forEach((header, i) => {
          if (!excludeColumns.includes(header.toLowerCase())) {
            filteredIndices.push(i);
            filteredHeaders.push(header);
          }
        });
        
        filteredCareerStats = {
          headers: filteredHeaders,
          rows: p.careerStats.rows.map(row => filteredIndices.map(i => row[i]))
        };
      }
      
      return {
        id: index + 1,
        playerName: p.playerName,
        number: p.number || null,
        position: p.position || '',
        imageUrl: p.imageUrl,
        height: p.height || null,
        weight: p.weight || null,
        hometown: p.hometown || null,
        state: p.state || null,
        year: p.year || null,
        highSchool: p.highSchool || null,
        achievements: p.achievements || [],
        careerStats: filteredCareerStats
      };
    });
    
    const jsonPath = path.join(__dirname, '../firebase/public/players.json');
    await fs.writeFile(jsonPath, JSON.stringify(jsonPlayers, null, 2), 'utf8');
    console.log(`✅ Created ${jsonPath}`);
    
    // Generate theroster.csv
    const csvPath = path.join(OUTPUT_DIR, 'theroster.csv');
    const csvHeader = '#,Name,year,Pos\n';
    const csvRows = players
      .filter(p => p.number)
      .sort((a, b) => a.number - b.number)
      .map(p => {
        const year = (p.year || '').toLowerCase();
        return `${p.number},${p.playerName},${year},${this.normalizePosition(p.position)}`;
      })
      .join('\n');
    
    await fs.writeFile(csvPath, csvHeader + csvRows, 'utf8');
    console.log(`✅ Created ${csvPath}`);
    
    console.log(`\n📊 Summary:`);
    console.log(`   - Total players: ${players.length}`);
    console.log(`   - With images: ${players.filter(p => !p.imageUrl.includes('default')).length}`);
    console.log(`   - Bios created: ${players.length}`);
    
    if (this.errors.length > 0) {
      console.log(`\n⚠️  Errors encountered: ${this.errors.length}`);
      this.errors.forEach(err => {
        console.log(`   - ${err.player}: ${err.error}`);
      });
    }
  }

  async run() {
    try {
      await this.init();
      
      // Step 1: Scrape roster list
      const players = await this.scrapeRosterList();
      
      // Step 2: Process each player (bio + images)
      const processedPlayers = await this.processPlayers(players);
      
      // Step 3: Generate output files
      await this.generateOutputFiles(processedPlayers);
      
      console.log('\n✨ Scraping complete!\n');
      
    } catch (error) {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    }
  }
}

// Run the scraper
if (require.main === module) {
  const scraper = new RosterScraper();
  scraper.run();
}

module.exports = RosterScraper;
