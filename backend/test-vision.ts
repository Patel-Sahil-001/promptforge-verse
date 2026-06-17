import { runVisionWithFallback } from "./src/_lib/providers.js";
import { config } from "dotenv";

config(); // load .env

async function test() {
    try {
        // A tiny 1x1 transparent PNG in base64
        const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        const mimeType = "image/png";
        
        console.log("Testing vision providers...");
        const result = await runVisionWithFallback(base64Image, mimeType);
        console.log("Result:", result.substring(0, 50) + "...");
    } catch (err) {
        console.error("Test failed:", err);
    }
}

test();
