import { getHomepageGames } from "../controllers/IGDBController";
import express from "express";
import { Request, Response } from "express";

const router = express.Router();

// router.get("/", async (req: Request, res: Response) => {
//   try {
//     const data = await getHomepageGames(req, res);
//     res.json(data);
//     return;
//   } catch (error) {
//     console.error("Error in homepage games route:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.get("/", async (req: Request, res: Response) => {
  try {
    // Call the controller function, which already sends the response with res.json
    await getHomepageGames(req, res);
    // Remove the redundant res.json(data) call to avoid double-sending and potential circular reference errors
    // res.json(data);  // <-- Commented out or removed
    return;
  } catch (error) {
    console.error("Error in homepage games route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
