import { getGamePageInfo } from "../controllers/IGDBController";
import express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.get("/:id", async (req: Request, res: Response) => {
  try {
    await getGamePageInfo(req, res);
  } catch (error) {
    console.error("Error in route handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
