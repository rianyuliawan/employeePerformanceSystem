// Must be imported before express/routers are used: patches Express so a
// rejected promise inside an async route handler reaches errorMiddleware
// instead of becoming an unhandled rejection that crashes the whole process.
import "express-async-errors";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { apiRoutes } from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/v1", apiRoutes);
app.use(errorMiddleware);

// On Vercel the app is invoked per-request via api/index.ts — listen() is
// only needed for local dev / a traditional long-running server process.
if (!process.env.VERCEL) {
  app.listen(env.port, () => {
    console.log(`Backend API running on http://localhost:${env.port}/api/v1`);
  });
}

export default app;

