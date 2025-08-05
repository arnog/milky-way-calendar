import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the locations.ts file
const locationsPath = path.join(__dirname, "../src/utils/locations.ts");
let content = fs.readFileSync(locationsPath, "utf8");

// Function to convert array format to object format
function convertArrayToObject(match, fullName, slug, lat, lng, areaId) {
  const obj = {
    fullName,
    slug,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  };

  if (areaId && areaId.trim() !== "") {
    obj.areaId = areaId;
  }

  // Format as object literal
  let result = "{\n    fullName: " + JSON.stringify(obj.fullName) + ",\n";
  result += "    slug: " + JSON.stringify(obj.slug) + ",\n";
  result += "    lat: " + obj.lat + ",\n";
  result += "    lng: " + obj.lng;

  if (obj.areaId) {
    result += ",\n    areaId: " + JSON.stringify(obj.areaId);
  }

  result += "\n  }";
  return result;
}

// Regular expression to match array format entries
// Matches: ["Full Name", "slug", lat, lng] or ["Full Name", "slug", lat, lng, "areaId"]
const arrayPattern =
  /\[\s*"([^"]+)",\s*"([^"]+)",\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)(?:,\s*"([^"]*)")?\s*\]/g;

// Replace all array format entries with object format
content = content.replace(arrayPattern, convertArrayToObject);

// Write the updated content back to the file
fs.writeFileSync(locationsPath, content, "utf8");

console.log(
  "Successfully converted locations.ts from array format to object format",
);
