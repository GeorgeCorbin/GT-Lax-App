# Roster Scraper

This script scrapes the GT Lacrosse roster from the official website and generates the data files needed for the app.

## Usage

Run the scraper from the project root:

```bash
npm run scrape-roster
```

Or directly:

```bash
node scripts/scrape-roster.js
```

## What It Does

1. **Fetches roster data** from `https://www.gtlacrosse.com/sports/mlax/2025-26/roster?view=list`
2. **Scrapes each player's bio page** for detailed information
3. **Downloads player headshot images** to `public/players/images/`
4. **Generates bio markdown files** to `public/players/bios/`
5. **Creates output files:**
   - `public/players/players.json` - Full player data with all metadata
   - `public/players/theroster.csv` - Simplified roster (number, name, position, year)

## Output Structure

### players.json
```json
[
  {
    "playerName": "George Corbin",
    "bioSlug": "corbin_george_hhiq",
    "year": "Sr",
    "height": "6'0\"",
    "position": "Defense",
    "hometown": "Atlanta",
    "highSchool": "Westminster",
    "number": 24,
    "weight": "185",
    "state": "GA",
    "imageUrl": "https://gt-lax-app.web.app/players/images/corbin_george_hhiq.jpg",
    "contentUrl": "https://gt-lax-app.web.app/players/bios/corbin_george_hhiq.md"
  }
]
```

### theroster.csv
```csv
#,Name,Pos,year
1,Mitch Savalli,G,sr
2,Will Ahmuty,D,jr
...
```

### Bio Markdown Files
Each player gets a `.md` file with their bio content extracted from the website.

## Deploying to Firebase

After running the scraper, deploy the updated files to Firebase:

```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting
```

The files will be available at:
- `https://gt-lax-app.web.app/players/players.json`
- `https://gt-lax-app.web.app/players/theroster.csv`
- `https://gt-lax-app.web.app/players/images/{player_slug}.jpg`
- `https://gt-lax-app.web.app/players/bios/{player_slug}.md`

## Dependencies

The scraper uses:
- **axios** - HTTP requests
- **cheerio** - HTML parsing
- **fs/promises** - File system operations

All dependencies are already included in the project's `package.json`.

## Troubleshooting

**Error: Cannot find module 'axios' or 'cheerio'**
- Run `npm install` to ensure all dependencies are installed

**Images not downloading**
- Check your internet connection
- The script will use a default image if download fails

**Bio pages failing to scrape**
- The website structure may have changed
- Check the console output for specific errors
- The script will continue with other players

## Notes

- The scraper includes a 500ms delay between requests to be respectful to the server
- Failed image downloads will use the default headshot
- All errors are logged but won't stop the entire process
- The script creates the output directories automatically if they don't exist
