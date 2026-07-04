// Vercel serverless entry point — Vercel's Node runtime treats a default
// export as a standard (req, res) handler, and an Express app satisfies
// that signature directly.
export { default } from "../src/server.js";
