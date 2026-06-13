const Task = require("../models/Task");
const Board = require("../models/Board");
const User = require("../models/User");

const canAccessBoard = (board, user) => {
  if (!board || !user) {
    return false;
  }

  if (user.role === "admin") {
    return true;
  }

  return board.members.some(
    (member) => member.toString() === user._id.toString()
  );
};

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    if (!canAccessBoard(board, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const assignedUser = await User.findById(req.body.assignedTo);

    if (!assignedUser) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      !board.members.some(
        (member) => member.toString() === req.body.assignedTo
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Users can only assign tasks to board members",
      });
    }

    const task = await Task.create({
      ...req.body,
      board: req.params.id,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL TASKS OF BOARD
const getBoardTasks = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    if (!canAccessBoard(board, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const filter = { board: req.params.id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    if (req.query.assignedTo) {
      filter.assignedTo = req.query.assignedTo;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [tasks, totalCount] = await Promise.all([
      Task.find(filter)
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(filter),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    res.json({
      success: true,
      count: tasks.length,
      totalCount,
      totalPages,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL TASKS (ADMIN)
const getAllTasks = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    if (req.query.assignedTo) {
      filter.assignedTo = req.query.assignedTo;
    }

    if (req.query.board) {
      filter.board = req.query.board;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE TASK
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("board")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!canAccessBoard(task.board, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("board");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!canAccessBoard(task.board, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isAssignee = task.assignedTo.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignee) {
      return res.status(403).json({
        success: false,
        message: "You can only update tasks assigned to you",
      });
    }

    const allowedFields = isAdmin
      ? ["title", "description", "status", "priority", "dueDate", "assignedTo", "comment"]
      : ["status", "comment"];

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("board", "title members");

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getBoardTasks,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};