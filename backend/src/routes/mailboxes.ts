import express, { Request, Response } from "express";
import { Mailbox } from "../types";
import mailboxesData from "../data/mailboxes.json";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/mailboxes - Get all mailboxes for current user
router.get("/", (req: Request, res: Response): void => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const mailboxes = (mailboxesData as Mailbox[]).filter(
      (mailbox) => mailbox.userId === userId
    );

    res.json({
      success: true,
      data: mailboxes,
    });
  } catch (error) {
    console.error("Get mailboxes error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/mailboxes/:id - Get specific mailbox by ID
router.get("/:id", (req: Request, res: Response): void => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const mailbox = (mailboxesData as Mailbox[]).find(
      (m) => m.id === id && m.userId === userId
    );

    if (!mailbox) {
      res.status(404).json({
        success: false,
        message: "Mailbox not found",
      });
      return;
    }

    res.json({
      success: true,
      data: mailbox,
    });
  } catch (error) {
    console.error("Get mailbox error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
