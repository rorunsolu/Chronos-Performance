import { getHomepageGames } from "../controllers/IGDBController";
import express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    await getHomepageGames(req, res);

    return;
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
