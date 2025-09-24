import { searchGamesByQuery } from "../controllers/IGDBController";
import express from "express";

const router = express.Router();

router.get("/search", async (request, response) => {
  const query = request.query.q as string;

  if (!query) {
    return response.json([]);
  }

  try {
    await searchGamesByQuery(query, response);
  } catch {
    response.status(500).json({ error: "Internal server error" });
  }
});

export default router;
