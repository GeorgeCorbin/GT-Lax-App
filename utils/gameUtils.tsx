/// <reference types="webpack-env" />

import { parse, isBefore, compareDesc } from 'date-fns';

// Utility to dynamically load all logos
export const loadTeamLogos = (assetsLink: __WebpackModuleApi.RequireContext): Record<string, any> => {
  const teamLogos: Record<string, any> = {};
  assetsLink.keys().forEach((fileName) => {
    const teamName = fileName
      .replace('./', '') // Remove './' from the beginning
      .replace(/\.\w+$/, '') // Remove the file extension
      .replace(/\s+/g, '') // Remove spaces
      .toLowerCase(); // Normalize to lowercase
    teamLogos[teamName] = assetsLink(fileName);
  });
  return teamLogos;
};

// Utility to get the team logo path
export const getTeamLogo = (teamLogos: Record<string, any>, teamName: string): any => {
  // Special case for TBD with conference context
  if (teamName === 'TBD_MCLA') {
    return teamLogos['tbd_mcla'] || teamLogos.placeholder;
  }
  if (teamName === 'TBD_SELC') {
    return teamLogos['tbd_selc'] || teamLogos.placeholder;
  }
  
  const formattedName = teamName.replace(/\s+/g, '').toLowerCase();
  return teamLogos[formattedName] || teamLogos.placeholder;
};

// Utility to dynamically load all field images
export const loadFieldImages = (assetsLink: __WebpackModuleApi.RequireContext): Record<string, any> => {
  const fieldImages: Record<string, any> = {};
  assetsLink.keys().forEach((fileName) => {
    const fieldName = fileName
      .replace('./', '') // Remove './' from the beginning
      .replace(/\.\w+$/, '') // Remove the file extension
      .replace(/\s+/g, '') // Remove spaces
      .toLowerCase(); // Normalize to lowercase
    fieldImages[fieldName] = assetsLink(fileName);
  });
  return fieldImages;
};

// Utility to get the field image path
export const getFieldImage = (fieldImages: Record<string, any>, teamName: string): any => {
  const formattedName = `${teamName.replace(/\s+/g, '').toLowerCase()}_field`;
  return fieldImages[formattedName] || null; // Return null if the image is missing (|| fieldImages.placeholder)
};

// Utility to determine if Georgia Tech is the home team
export const isHomeTeam = (title: string): boolean => {
  return title.includes('vs. Georgia Tech') || title.includes(', Georgia Tech');
};

export const isSELCorMCLA = (title: string): { city: string; fieldName: string; latitude: number; longitude: number; } => {
  const selcDetails = { city: 'Jacksonville, FL', fieldName: "Bolles Stadium", latitude: 30.185916, longitude: -81.602356 };
  const mclaDetails = { city: 'Round Rock, TX', fieldName: "Round Rock", latitude: 30.508255, longitude: -97.678896 };

  if (title.includes('SELC')) {
    return selcDetails;
  } else if (title.includes('MCLA')) {
    return mclaDetails;
  } else {
    return { city: '', fieldName: '', latitude: 0, longitude: 0 };
  }
}
  
// Utility to clean and extract team names
export const extractTeams = (title: string): { awayTeam: string; homeTeam: string } => {
  
  // Check if this is an MCLA or SELC game (check original title for TBD)
  const isMCLAGame = title.includes('MCLA');
  const isSELCGame = title.includes('SELC');
  const hasTBD = title.includes('TBD');
  
  const cleanedTitle = title.replace(/Final.*/i, '').trim();
  const parts = cleanedTitle.includes('vs.') ? cleanedTitle.split('vs.') : cleanedTitle.split(',');
  
  
  // For games with TBD opponents, use a consistent "TBD" name with the conference context
  if (isMCLAGame || isSELCGame) {
    const awayTeam = parts[0]?.replace(/\d+/g, '').trim() || 'TBD';
    const homeTeam = parts[1]?.replace(/\d+/g, '').trim() || 'TBD';
    
    
    // Check if a team should be replaced with TBD_SELC or TBD_MCLA
    // This happens if: the team name contains "TBD", OR if the original title has TBD and the team name is just the conference/round info
    const isAwayTBD = awayTeam.includes('TBD') || (hasTBD && (awayTeam.includes('SELC') || awayTeam.includes('MCLA') || awayTeam.includes('Quarter')));
    const isHomeTBD = homeTeam.includes('TBD') || (hasTBD && (homeTeam.includes('SELC') || homeTeam.includes('MCLA') || homeTeam.includes('Quarter')));
    
    const result = {
      awayTeam: isAwayTBD ? (isMCLAGame ? 'TBD_MCLA' : 'TBD_SELC') : awayTeam,
      homeTeam: isHomeTBD ? (isMCLAGame ? 'TBD_MCLA' : 'TBD_SELC') : homeTeam
    };
    
    return result;
  }
  
  // For regular games, use the standard extraction
  return {
    awayTeam: parts[0]?.replace(/\d+/g, '').trim() || 'Away Team',
    homeTeam: parts[1]?.replace(/\d+/g, '').trim() || 'Home Team',
  };
};
  
// Utility to extract scores from a title
export const extractScores = (title: string): { awayScore: string; homeScore: string } => {
  const cleanedTitle = title.replace(/Final.*/i, '').trim();
  const [awayPart, homePart] = cleanedTitle.split(',');

  const extractScore = (part: string) => {
    const match = part.match(/(\d+)\s*(,|\s|$)/);
    return match ? match[1] : '0';
  };

  return {
    awayScore: extractScore(awayPart),
    homeScore: extractScore(homePart),
  };
};

// Utility to get rankings for a team on a specific date
export const getRankingForTeamOnDate = (
  rankings: any[],
  teamName: string,
  gameDate: string
): number | null => {
  if (!rankings.length) {
    return null;
  }

  const gameDateObj = new Date(gameDate);

  // Find the latest ranking published before or on the game date
  const applicableRanking = rankings
    .filter((ranking) => {
      const rankingDate = parse(ranking.date, 'MMMM dd, yyyy', new Date()); // Parse with a specific format
      return isBefore(rankingDate, gameDateObj) || rankingDate.getTime() === gameDateObj.getTime();
    })
    .sort((a, b) => compareDesc(parse(a.date, 'MMMM dd, yyyy', new Date()), parse(b.date, 'MMMM dd, yyyy', new Date())))[0];
  
  if (!applicableRanking) return null;

  // Parse the rankings list into an array of ranked teams
  const rankList = applicableRanking.list.split(',').map((entry: string) => entry.trim());

  // Use an exact match for the team name
  const teamRank = rankList.findIndex((entry: string) => {
    // Extract the team name from the ranking entry (e.g., "1. Georgia Tech" -> "Georgia Tech")
    const entryTeamName = entry.replace(/^\d+\.\s*/, '').toLowerCase(); // Remove the rank number and whitespace
    return entryTeamName === teamName.toLowerCase(); // Exact match
  });

  return teamRank !== -1 ? teamRank + 1 : null; // Rankings are 1-based
};

// Utility to get the city, field name, latitude, and longitude of each university
// export const getUniversityDetails = (teamName: string): { city: string; fieldName: string; latitude: number; longitude: number; conference: string; region: string } => {
//   const unknownFieldName = "Unknown";
//   const unknownRegion = "";

//   type UniversityDetails = {
//     city: string;
//     fieldName: string;
//     latitude: number;
//     longitude: number;
//     conference: string;
//     region: string;
//   };

  // const universityDetails: Record<string, UniversityDetails> = {
  //   'alabama': { city: 'Tuscaloosa, AL', fieldName: "Alabama Intramural Fields Field #2", latitude: 33.2095614, longitude: -87.5675258, conference: 'SELC', region: 'North' },
  //   'arizonastate': { city: 'Tempe, AZ', fieldName: unknownFieldName, latitude: 33.4255117, longitude: -111.940016, conference: 'SLC', region: unknownRegion },
  //   'arizona': { city: 'Tucson, AZ', fieldName: unknownFieldName, latitude: 32.2228765, longitude: -110.974847, conference: 'SLC', region: unknownRegion },
  //   'arkansas': { city: 'Fayetteville, AR', fieldName: unknownFieldName, latitude: 36.0625843, longitude: -94.1574328, conference: 'LSA', region: 'North' },
  //   'auburn': { city: 'Auburn, AL', fieldName: 'Auburn Club Sports Fields', latitude: 32.6098566, longitude: -85.4807825, conference: 'SELC', region: 'South' },
  //   'baylor': { city: 'Waco, TX', fieldName: unknownFieldName, latitude: 31.549333, longitude: -97.1466695, conference: 'LSA', region: 'North' },
  //   'boisestate': { city: 'Boise, ID', fieldName: unknownFieldName, latitude: 43.6166163, longitude: -116.200886, conference: 'PNCLL', region: unknownRegion },
  //   'bostoncollege': { city: 'Chestnut Hill, MA', fieldName: unknownFieldName, latitude: 42.3306529, longitude: -71.1661647, conference: 'CLC', region: unknownRegion },
  //   'byu': { city: 'Provo, UT', fieldName: 'BYU West Stadium Field', latitude: 40.2337289, longitude: -111.6587085, conference: 'RMLC', region: unknownRegion },
  //   'buffalo': { city: 'Buffalo, NY', fieldName: unknownFieldName, latitude: 42.8867166, longitude: -78.8783922, conference: 'CLC', region: unknownRegion },
  //   'calpoly': { city: 'San Luis Obispo, CA', fieldName: unknownFieldName, latitude: 35.3540209, longitude: -120.375716, conference: 'WCLL', region: unknownRegion },
  //   'california': { city: 'Berkeley, CA', fieldName: unknownFieldName, latitude: 37.8708393, longitude: -122.272863, conference: 'WCLL', region: unknownRegion },
  //   'centralflorida': { city: 'Orlando, FL', fieldName: 'RWC Park', latitude: 28.5421109, longitude: -81.3790304, conference: 'SELC', region: unknownRegion },
  //   'chapman': { city: 'Orange, CA', fieldName: unknownFieldName, latitude: 33.750631, longitude: -117.8722311, conference: 'SLC', region: unknownRegion },
  //   'clemson': { city: 'Clemson, SC', fieldName: 'Clemson Rec Sports Fields', latitude: 34.6850749, longitude: -82.8364111, conference: 'ALC', region: 'South' },
  //   'colorado': { city: 'Boulder, CO', fieldName: unknownFieldName, latitude: 40.0149856, longitude: -105.270545, conference: 'RMLC', region: unknownRegion },
  //   'coloradostate': { city: 'Fort Collins, CO', fieldName: unknownFieldName, latitude: 40.5871782, longitude: -105.0770113, conference: 'RMLC', region: unknownRegion },
  //   'concordiairvine': { city: 'Irvine, CA', fieldName: unknownFieldName, latitude: 33.6856969, longitude: -117.825981, conference: 'SLC', region: unknownRegion },
  //   'connecticut': { city: 'Storrs, CT', fieldName: unknownFieldName, latitude: 41.8084314, longitude: -72.2495231, conference: 'CLC', region: unknownRegion },
  //   'eastcarolina': { city: 'Greenville, NC', fieldName: unknownFieldName, latitude: 35.613224, longitude: -77.3724593, conference: 'ALC', region: 'South' },
  //   'florida': { city: 'Gainesville, FL', fieldName: 'Maguire Field', latitude: 29.6519684, longitude: -82.3249846, conference: 'SELC', region: 'South' },
  //   'floridastate': { city: 'Tallahassee, FL', fieldName: 'Seminoles Field', latitude: 30.4380832, longitude: -84.2809332, conference: 'SELC', region: 'South' },
  //   'georgia': { city: 'Athens, GA', fieldName: 'Georgia Club Sports Complex', latitude: 33.9597677, longitude: -83.376398, conference: 'SELC', region: 'North' },
  //   'georgiatech': { city: 'Atlanta, GA', fieldName: 'Roe Stamps Field', latitude: 33.7489924, longitude: -84.3902644, conference: 'SELC', region: 'North' },
  //   'grandcanyon': { city: 'Phoenix, AZ', fieldName: unknownFieldName, latitude: 33.4484367, longitude: -112.074141, conference: 'SLC', region: unknownRegion },
  //   'highpoint': { city: 'High Point, NC', fieldName: unknownFieldName, latitude: 35.955692, longitude: -80.005318, conference: 'ALC', region: 'South' },
  //   'illinois': { city: 'Champaign, IL', fieldName: unknownFieldName, latitude: 40.1164841, longitude: -88.2430932, conference: 'UMLC', region: 'West' },
  //   'indiana': { city: 'Bloomington, IN', fieldName: unknownFieldName, latitude: 39.1670396, longitude: -86.5342881, conference: 'UMLC', region: 'East' },
  //   'iowastate': { city: 'Ames, IA', fieldName: unknownFieldName, latitude: 42.0267567, longitude: -93.6170448, conference: 'UMLC', region: 'West' },
  //   'jmu': { city: 'Harrisonburg, VA', fieldName: unknownFieldName, latitude: 38.4493315, longitude: -78.8688833, conference: 'ALC', region: 'North' },
  //   'kansas': { city: 'Lawrence, KS', fieldName: unknownFieldName, latitude: 38.9719137, longitude: -95.2359403, conference: 'LSA', region: 'North' },
  //   'kennesawstate': { city: 'Kennesaw, GA', fieldName: unknownFieldName, latitude: 34.0234337, longitude: -84.6154897, conference: 'D2 SELC', region: 'North' },
  //   'kentucky': { city: 'Lexington, KY', fieldName: unknownFieldName, latitude: 38.0405837, longitude: -84.5037164, conference: 'ALC', region: 'North' },
  //   'liberty': { city: 'Lynchburg, VA', fieldName: "Liberty Men's Lacrosse Field", latitude: 37.4137536, longitude: -79.1422464, conference: 'ALC', region: 'North' },
  //   'louisville': { city: 'Louisville, KY', fieldName: unknownFieldName, latitude: 38.2542376, longitude: -85.759407, conference: 'ALC', region: 'North' },
  //   'lsu': { city: 'Baton Rouge, LA', fieldName: unknownFieldName, latitude: 30.4494155, longitude: -91.1869659, conference: 'LSA', region: 'South' },
  //   'miamiohio': { city: 'Miami, OH', fieldName: unknownFieldName, latitude: 39.5108574, longitude: -84.7315563, conference: 'UMLC', region: 'East' },
  //   'michiganstate': { city: 'East Lansing, MI', fieldName: unknownFieldName, latitude: 42.734732, longitude: -84.480595, conference: 'UMLC', region: 'East' },
  //   'minnesota': { city: 'Minneapolis, MN', fieldName: unknownFieldName, latitude: 44.986656, longitude: -93.258133, conference: 'UMLC', region: 'West' },
  //   'missouri': { city: 'Columbia, MO', fieldName: unknownFieldName, latitude: 38.951705, longitude: -92.334072, conference: 'LSA', region: 'North' },
  //   'nebraska': { city: 'Lincoln, NE', fieldName: unknownFieldName, latitude: 40.813616, longitude: -96.702596, conference: 'UMLC', region: 'West' },
  //   'nevada': { city: 'Reno, NV', fieldName: unknownFieldName, latitude: 39.529632, longitude: -119.813802, conference: 'WCLL', region: unknownRegion },
  //   'newhampshire': { city: 'Durham, NH', fieldName: unknownFieldName, latitude: 43.133916, longitude: -70.926434, conference: 'CLC', region: unknownRegion },
  //   'northcarolinastate': { city: 'Raleigh, NC', fieldName: unknownFieldName, latitude: 35.784663, longitude: -78.682094, conference: 'ALC', region: 'South' },
  //   'unc': { city: 'Chapel Hill, NC', fieldName: unknownFieldName, latitude: 35.904575, longitude: -79.046883, conference: 'ALC', region: 'South' },
  //   'northeastern': { city: 'Boston, MA', fieldName: unknownFieldName, latitude: 42.339806, longitude: -71.089171, conference: 'CLC', region: unknownRegion },
  //   'oklahoma': { city: 'Norman, OK', fieldName: unknownFieldName, latitude: 35.222565, longitude: -97.439478, conference: 'LSA', region: 'North' },
  //   'olemiss': { city: 'Oxford, MS', fieldName: unknownFieldName, latitude: 34.366495, longitude: -89.519248, conference: 'LSA', region: 'North' },
  //   'oregon': { city: 'Eugene, OR', fieldName: unknownFieldName, latitude: 44.052069, longitude: -123.086754, conference: 'PNCLL', region: unknownRegion },
  //   'oregonstate': { city: 'Corvallis, OR', fieldName: unknownFieldName, latitude: 44.564566, longitude: -123.262044, conference: 'PNCLL', region: unknownRegion },
  //   'syracuse': { city: 'State College, PA', fieldName: unknownFieldName, latitude: 40.793394, longitude: -77.860001, conference: 'CLC', region: unknownRegion },
  //   'pittsburgh': { city: 'Pittsburgh, PA', fieldName: unknownFieldName, latitude: 40.440624, longitude: -79.995888, conference: 'ALC', region: 'North' },
  //   'purdue': { city: 'West Lafayette, IN', fieldName: unknownFieldName, latitude: 40.425869, longitude: -86.908066, conference: 'UMLC', region: 'East' },
  //   'sandiegostate': { city: 'San Diego, CA', fieldName: unknownFieldName, latitude: 32.715736, longitude: -117.161087, conference: 'SLC', region: unknownRegion },
  //   'santaclara': { city: 'Santa Clara, CA', fieldName: unknownFieldName, latitude: 37.354107, longitude: -121.955238, conference: 'WCLL', region: unknownRegion },
  //   'sonomastate': { city: 'Rohnert Park, CA', fieldName: unknownFieldName, latitude: 38.339636, longitude: -122.701098, conference: 'WCLL', region: unknownRegion },
  //   'southcarolina': { city: 'Columbia, SC', fieldName: 'The Strom', latitude: 34.000710, longitude: -81.034814, conference: 'SELC', region: 'South' },
  //   'southflorida': { city: 'Tampa, FL', fieldName: unknownFieldName, latitude: 27.9477595, longitude: -82.458444, conference: 'SELC', region: 'North' },
  //   'southernmethodist': { city: 'Dallas, TX', fieldName: unknownFieldName, latitude: 32.7762719, longitude: -96.7968559, conference: 'LSA', region: 'South' },
  //   'stanford': { city: 'Stanford, CA', fieldName: unknownFieldName, latitude: 37.4383017, longitude: -122.1561814, conference: 'WCLL', region: unknownRegion },
  //   'simonfraser': { city: 'Burnaby, British Columbia', fieldName: unknownFieldName, latitude: 49.2827291, longitude: -122.9188857, conference: 'PNCLL', region: unknownRegion },
  //   'tcu': { city: 'Fort Worth, TX', fieldName: unknownFieldName, latitude: 32.753177, longitude: -97.3327459, conference: 'LSA', region: 'South' },
  //   'temple': { city: 'Philadelphia, PA', fieldName: unknownFieldName, latitude: 39.9527237, longitude: -75.1635262, conference: 'ALC', region: 'North' },
  //   'tennessee': { city: 'Knoxville, TN', fieldName: unknownFieldName, latitude: 35.9603948, longitude: -83.9210261, conference: 'ALC', region: 'South' },
  //   'texasam': { city: 'College Station, TX', fieldName: unknownFieldName, latitude: 30.6183939, longitude: -96.3455991, conference: 'LSA', region: 'South' },
  //   'texasstate': { city: 'San Marcos, TX', fieldName: unknownFieldName, latitude: 29.8826436, longitude: -97.9405828, conference: 'LSA', region: 'South' },
  //   'texastech': { city: 'Lubbock, TX', fieldName: unknownFieldName, latitude: 33.5855677, longitude: -101.8470215, conference: 'LSA', region: 'South' },
  //   'texas': { city: 'Austin, TX', fieldName: unknownFieldName, latitude: 30.2711286, longitude: -97.7436995, conference: 'LSA', region: 'South' },
  //   'ucsantabarbara': { city: 'Santa Barbara, CA', fieldName: unknownFieldName, latitude: 34.4221319, longitude: -119.702667, conference: 'WCLL', region: unknownRegion },
  //   'ucla': { city: 'Los Angeles, CA', fieldName: unknownFieldName, latitude: 34.0536909, longitude: -118.242766, conference: 'SLC', region: unknownRegion },
  //   'usc': { city: 'Los Angeles, CA', fieldName: unknownFieldName, latitude: 34.0536909, longitude: -118.242766, conference: 'SLC', region: unknownRegion },
  //   'utahvalley': { city: 'Orem, UT', fieldName: ' Utah Valley University Field', latitude: 40.2981599, longitude: -111.6944313, conference: 'RMLC', region: unknownRegion },
  //   'utah': { city: 'Salt Lake City, UT', fieldName: unknownFieldName, latitude: 40.7596198, longitude: -111.886797, conference: 'RMLC', region: unknownRegion },
  //   'utahtech': { city: 'Salt Lake City, UT', fieldName: unknownFieldName, latitude: 40.7596198, longitude: -111.886797, conference: 'RMLC', region: unknownRegion },
  //   'virginiatech': { city: 'Blacksburg, VA', fieldName: "The Marching Virginians Center", latitude: 37.2296566, longitude: -80.4136767, conference: 'ALC', region: 'South' },
  //   'virginia': { city: 'Charlottesville, VA', fieldName: unknownFieldName, latitude: 38.029306, longitude: -78.4766781, conference: 'ALC', region: 'North' },
  //   'walsh': { city: 'North Canton, OH', fieldName: unknownFieldName, latitude: 40.875891, longitude: -81.402336, conference: 'ALC', region: 'North' },
  //   'washingtonstate': { city: 'Pullman, WA', fieldName: unknownFieldName, latitude: 46.7304268, longitude: -117.173895, conference: 'PNCLL', region: unknownRegion },
  //   'washington': { city: 'Seattle, WA', fieldName: unknownFieldName, latitude: 47.6038321, longitude: -122.330062, conference: 'PNCLL', region: unknownRegion },
  //   'westvirginia': { city: 'Morgantown, WV', fieldName: unknownFieldName, latitude: 39.6296809, longitude: -79.9559437, conference: 'ALC', region: 'North' },
  //   'westernmichigan': { city: 'Kalamazoo, MI', fieldName: unknownFieldName, latitude: 42.291707, longitude: -85.5872286, conference: 'UMLC', region: 'East' },
  // };
    

  // const formattedName = teamName.replace(/\s+/g, '').toLowerCase();
  // return universityDetails[formattedName] || { city: unknownFieldName, fieldName: unknownFieldName, latitude: 0, longitude: 0 };
// };

  