import { getHomepageGames } from "../controllers/IGDBController";
import express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await getHomepageGames(req, res);
    res.json(data);
    return;
  } catch (error) {
    console.error("Error in homepage games route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
