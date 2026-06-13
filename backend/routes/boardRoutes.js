const express = require("express");

const {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  addMember,
  removeMember,
} = require("../controllers/boardController");

const { protect } = require("../middleware/authMiddleware");

const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateBoard
);

router.post(
  "/",
  protect,
  authorize("admin"),
  createBoard
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteBoard
);

router.post(
  "/:id/members",
  protect,
  authorize("admin"),
  addMember
);

router.delete(
  "/:id/members/:userId",
  protect,
  authorize("admin"),
  removeMember
);

// GET ALL BOARDS
router.get("/", protect, getBoards);

// GET SINGLE BOARD
router.get("/:id", protect, getBoardById);

module.exports = router;