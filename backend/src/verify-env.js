import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

// Manually resolve .env path since we are running this script from src/
// But dotenv/config usually picks up .env in the current working directory (cwd).
// If we run from backend/, it should work.

console.log("Checking Environment Variables...");
if (process.env.JWT_SECRET) {
    console.log("✅ JWT_SECRET is present: " + process.env.JWT_SECRET.substring(0, 5) + "...");
} else {
    console.error("❌ JWT_SECRET is MISSING");
}

if (process.env.REFRESH_TOKEN_SECRET) {
    console.log("✅ REFRESH_TOKEN_SECRET is present");
} else {
    console.error("❌ REFRESH_TOKEN_SECRET is MISSING");
}
