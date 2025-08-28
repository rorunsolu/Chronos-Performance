import { getHomepageGames } from "../controllers/IGDBController";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await getHomepageGames();
    res.json(response);
  } catch (error) {
    console.error("Error in homepage games route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
