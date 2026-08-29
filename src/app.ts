import path from "path";
import express from "express";
import cors from "cors";
import { fetchResume } from "./scraper.js";
import type { ApiResponse } from "./types.js";

const app = express();
app.use(cors());
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/api/profile", async (req, res) => {
  const { id, key } = req.query as { id?: string; key?: string };

  if (!id || !key) {
    const response: ApiResponse = {
      success: false,
      error: "Missing required query parameters: id and key",
    };
    res.status(400).json(response);
    return;
  }

  try {
    const data = await fetchResume(id, key);
    const response: ApiResponse = { success: true, data };
    res.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("Invalid profile") ? 404 : 502;
    const response: ApiResponse = { success: false, error: message };
    res.status(status).json(response);
  }
});

export default app;
