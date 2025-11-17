import express, { Request, Response } from "express";
import { Email } from "../types";
import emailsData from "../data/emails.json";
import mailboxesData from "../data/mailboxes.json";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// In-memory email store (initialized from JSON)
let emails = [...(emailsData as Email[])];

// GET /api/mailboxes/:mailboxId/emails - Get emails for a specific mailbox
router.get(
  "/mailboxes/:mailboxId/emails",
  (req: Request, res: Response): void => {
    try {
      const userId = req.user?.userId;
      const { mailboxId } = req.params;
      const { page = "1", limit = "50" } = req.query;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      // Verify mailbox belongs to user
      const mailbox = mailboxesData.find(
        (m) => m.id === mailboxId && m.userId === userId
      );

      if (!mailbox) {
        res.status(404).json({
          success: false,
          message: "Mailbox not found",
        });
        return;
      }

      // Filter emails by mailbox and user
      const mailboxEmails = emails.filter(
        (email) => email.mailboxId === mailboxId && email.userId === userId
      );

      // Sort by timestamp (newest first)
      mailboxEmails.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Pagination
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedEmails = mailboxEmails.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: paginatedEmails,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: mailboxEmails.length,
          totalPages: Math.ceil(mailboxEmails.length / limitNum),
        },
      });
    } catch (error) {
      console.error("Get mailbox emails error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// GET /api/emails/:id - Get specific email by ID
router.get("/emails/:id", (req: Request, res: Response): void => {
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

    const email = emails.find((e) => e.id === id && e.userId === userId);

    if (!email) {
      res.status(404).json({
        success: false,
        message: "Email not found",
      });
      return;
    }

    res.json({
      success: true,
      data: email,
    });
  } catch (error) {
    console.error("Get email error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PATCH /api/emails/:id - Update email (mark as read/unread, star/unstar)
router.patch("/emails/:id", (req: Request, res: Response): void => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { isRead, isStarred } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const emailIndex = emails.findIndex(
      (e) => e.id === id && e.userId === userId
    );

    if (emailIndex === -1) {
      res.status(404).json({
        success: false,
        message: "Email not found",
      });
      return;
    }

    // Update email properties
    if (typeof isRead === "boolean") {
      emails[emailIndex].isRead = isRead;
    }
    if (typeof isStarred === "boolean") {
      emails[emailIndex].isStarred = isStarred;
    }

    res.json({
      success: true,
      data: emails[emailIndex],
    });
  } catch (error) {
    console.error("Update email error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// DELETE /api/emails/:id - Delete email (move to trash)
router.delete("/emails/:id", (req: Request, res: Response): void => {
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

    const emailIndex = emails.findIndex(
      (e) => e.id === id && e.userId === userId
    );

    if (emailIndex === -1) {
      res.status(404).json({
        success: false,
        message: "Email not found",
      });
      return;
    }

    // Find trash mailbox
    const trashMailbox = mailboxesData.find(
      (m) => m.name === "Trash" && m.userId === userId
    );

    if (trashMailbox) {
      // Move to trash
      emails[emailIndex].mailboxId = trashMailbox.id;
    } else {
      // If no trash mailbox, actually delete
      emails.splice(emailIndex, 1);
    }

    res.json({
      success: true,
      message: "Email deleted successfully",
    });
  } catch (error) {
    console.error("Delete email error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// POST /api/emails/bulk-action - Bulk actions on multiple emails
router.post("/emails/bulk-action", (req: Request, res: Response): void => {
  try {
    const userId = req.user?.userId;
    const { emailIds, action, value } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!Array.isArray(emailIds) || !action) {
      res.status(400).json({
        success: false,
        message: "Invalid request parameters",
      });
      return;
    }

    let updatedCount = 0;

    emailIds.forEach((emailId) => {
      const emailIndex = emails.findIndex(
        (e) => e.id === emailId && e.userId === userId
      );

      if (emailIndex !== -1) {
        switch (action) {
          case "markRead":
            emails[emailIndex].isRead = true;
            updatedCount++;
            break;
          case "markUnread":
            emails[emailIndex].isRead = false;
            updatedCount++;
            break;
          case "star":
            emails[emailIndex].isStarred = true;
            updatedCount++;
            break;
          case "unstar":
            emails[emailIndex].isStarred = false;
            updatedCount++;
            break;
          case "delete":
            const trashMailbox = mailboxesData.find(
              (m) => m.name === "Trash" && m.userId === userId
            );
            if (trashMailbox) {
              emails[emailIndex].mailboxId = trashMailbox.id;
              updatedCount++;
            }
            break;
        }
      }
    });

    res.json({
      success: true,
      message: `${updatedCount} email(s) updated`,
      updatedCount,
    });
  } catch (error) {
    console.error("Bulk action error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
