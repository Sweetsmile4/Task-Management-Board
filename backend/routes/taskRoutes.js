const express = require("express");

const {
  createTask,
  getBoardTasks,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/boards/:id/tasks",
  protect,
  createTask
);

router.get(
  "/boards/:id/tasks",
  protect,
  getBoardTasks
);

router.get(
  "/tasks/:id",
  protect,
  getTaskById
);

router.get(
  "/admin/tasks",
  protect,
  authorize("admin"),
  getAllTasks
);

router.put(
  "/tasks/:id",
  protect,
  updateTask
);

router.delete(
  "/tasks/:id",
  protect,
  authorize("admin"),
  deleteTask
);

module.exports = router;