import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the locations.ts file
const locationsPath = path.join(__dirname, '../src/utils/locations.ts');
let content = fs.readFileSync(locationsPath, 'utf8');

// Function to convert object format back to array format
function convertObjectToArray(match, fullContent) {
  // Extract properties using regex
  const fullNameMatch = fullContent.match(/fullName:\s*"([^"]+)"/);
  const slugMatch = fullContent.match(/slug:\s*"([^"]+)"/);
  const latMatch = fullContent.match(/lat:\s*(-?\d+(?:\.\d+)?)/);
  const lngMatch = fullContent.match(/lng:\s*(-?\d+(?:\.\d+)?)/);
  const areaIdMatch = fullContent.match(/areaId:\s*"([^"]*)"/);
  
  if (!fullNameMatch || !slugMatch || !latMatch || !lngMatch) {
    return match; // Return original if parsing fails
  }
  
  const fullName = fullNameMatch[1];
  const slug = slugMatch[1];
  const lat = latMatch[1];
  const lng = lngMatch[1];
  const areaId = areaIdMatch ? areaIdMatch[1] : null;
  
  // Format as array literal
  if (areaId) {
    return `["${fullName}", "${slug}", ${lat}, ${lng}, "${areaId}"]`;
  } else {
    return `["${fullName}", "${slug}", ${lat}, ${lng}]`;
  }
}

// Regular expression to match object format entries
const objectPattern = /\{\s*\n\s*fullName:\s*"[^"]+",\s*\n\s*slug:\s*"[^"]+",\s*\n\s*lat:\s*-?\d+(?:\.\d+)?,\s*\n\s*lng:\s*-?\d+(?:\.\d+)?(?:,\s*\n\s*areaId:\s*"[^"]*")?\s*\n\s*\}/g;

// Replace all object format entries with array format
content = content.replace(objectPattern, (match) => {
  return convertObjectToArray(match, match);
});

// Write the updated content back to the file
fs.writeFileSync(locationsPath, content, 'utf8');

console.log('Successfully reverted locations.ts from object format to array format');