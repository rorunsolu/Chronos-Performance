import { getIgdbEvents } from "../controllers/eventController";
import express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    await getIgdbEvents(req, res);
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ error: errorMsg });
  }
});

export default router;
