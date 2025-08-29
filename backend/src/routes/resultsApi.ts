import { searchGamesByQuery } from "../controllers/IGDBController";
import express from "express";

const router = express.Router();

router.get("/search", async (request, response) => {
  const query = request.query.q as string;

  if (!query) {
    return response.json([]);
  }

  try {
    const results = await searchGamesByQuery(query);
    response.json(results);
  } catch (error) {
    console.error("Error in search route:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

export default router;
