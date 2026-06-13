import { memo, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api, { tasksQueryKey, taskDetailsQueryKey } from "../services/api";

function TaskList({ boardId, refresh, assignees = [] }) {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedTask, setSelectedTask] = useState(null);
  const [editState, setEditState] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { data: tasksData = {}, isLoading, refetch } = useQuery({
    queryKey: tasksQueryKey(boardId, page, limit),
    queryFn: async () => {
      const res = await api.get(`/boards/${boardId}/tasks?page=${page}&limit=${limit}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 30,
  });

  const tasks = tasksData.data || [];
  const totalPages = tasksData.totalPages || 1;

  const groupedTasks = useMemo(
    () => ({
      Todo: tasks.filter((task) => task.status === "Todo"),
      InProgress: tasks.filter((task) => task.status === "InProgress"),
      Done: tasks.filter((task) => task.status === "Done"),
    }),
    [tasks]
  );

  const { refetch: fetchTaskDetail } = useQuery({
    queryKey: ["taskDetail", selectedTask?._id],
    queryFn: async () => {
      if (!selectedTask) return null;
      const res = await api.get(`/tasks/${selectedTask._id}`);
      return res.data.data;
    },
    enabled: !!selectedTask,
  });

  const openTask = async (task) => {
    try {
      const res = await api.get(`/tasks/${task._id}`);
      setSelectedTask(res.data.data);
      setEditState({
        ...res.data.data,
        dueDate: res.data.data.dueDate ? res.data.data.dueDate.slice(0, 10) : "",
        assignedTo: res.data.data.assignedTo?._id || "",
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to load task details"
      );
    }
  };

  const saveTask = async () => {
    if (!selectedTask || !editState) {
      return;
    }

    try {
      setSaving(true);
      await api.put(`/tasks/${selectedTask._id}`, editState);
      setSelectedTask(null);
      setEditState(null);
      refetch();
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Failed to save task"
      );
    } finally {
      setSaving(false);
    }
  };

  const PriorityBadge = ({ priority }) => {
    const className =
      priority === "High"
        ? "text-bg-danger"
        : priority === "Low"
          ? "text-bg-success"
          : "text-bg-warning";

    return <span className={`badge ${className}`}>{priority}</span>;
  };

  const TaskCard = memo(function TaskCard({ task, onClick, onStatusChange }) {
    const initials = task.assignedTo?.name
      ? task.assignedTo.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "?";

    return (
      <button
        type="button"
        className="card border-0 shadow-sm text-start w-100 mb-3 task-card"
        onClick={() => onClick(task)}
        style={{ cursor: "pointer" }}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between gap-3 mb-2">
            <div>
              <h4 className="h6 mb-1">{task.title}</h4>
              <div className="text-muted small">{task.assignedTo?.name || "Unassigned"}</div>
            </div>
            <div className="rounded-circle bg-dark text-white d-inline-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
              {initials}
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
            <PriorityBadge priority={task.priority} />
            {task.dueDate ? <span className="badge text-bg-light">Due {new Date(task.dueDate).toLocaleDateString()}</span> : null}
          </div>

          <p className="text-muted small mb-0 text-truncate">{task.description || "No description"}</p>

          <div className="mt-3" onClick={(event) => event.stopPropagation()}>
            <select
              className="form-select form-select-sm"
              value={task.status}
              onChange={async (e) => {
                e.stopPropagation();
                await onStatusChange(task, e.target.value);
              }}
            >
              <option value="Todo">Todo</option>
              <option value="InProgress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>
      </button>
    );
  });

  const updateStatus = async (task, status) => {
    try {
      await api.put(`/tasks/${task._id}`, { status });
      refetch();
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Failed to update task status"
      );
    }
  };

  const columns = [
    {
      key: "Todo",
      title: "Todo",
      className: "kanban-column border-start border-4 border-secondary bg-light-subtle",
    },
    {
      key: "InProgress",
      title: "In Progress",
      className: "kanban-column border-start border-4 border-primary bg-light-subtle",
    },
    {
      key: "Done",
      title: "Done",
      className: "kanban-column border-start border-4 border-success bg-light-subtle",
    },
  ];

  const renderTasks = (taskArray) =>
    taskArray.map((task) => (
      <TaskCard
        key={task._id}
        task={task}
        onClick={openTask}
        onStatusChange={updateStatus}
      />
    ));

  const EmptyColumn = ({ title, message }) => (
    <div className="empty-state mt-3">
      <h4 className="h6 mb-1">{title}</h4>
      <p className="page-muted mb-0">{message}</p>
    </div>
  );

  return (
    <div className="mt-4">
      {error ? <div className="alert alert-danger">{error}</div> : null}

      {isLoading ? <div className="text-muted mb-3">Loading tasks...</div> : null}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-dark" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            ← Prev
          </button>
          <span className="badge text-bg-dark align-self-center">Page {page} of {totalPages}</span>
          <button className="btn btn-sm btn-outline-dark" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
            Next →
          </button>
        </div>
        <button className="btn btn-sm btn-outline-dark" onClick={() => refetch()} title="Refresh tasks">
          ↻
        </button>
      </div>

      <div className="row g-3">
        {columns.map((column) => {
          const columnTasks = groupedTasks[column.key];

          return (
            <div className="col-12 col-lg-4" key={column.key}>
              <div className={`card h-100 border-0 shadow-sm ${column.className}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="h5 mb-0">{column.title}</h3>
                    <span className="badge text-bg-dark">{columnTasks.length}</span>
                  </div>
                  {columnTasks.length ? (
                    renderTasks(columnTasks)
                  ) : (
                    <EmptyColumn
                      title={`No ${column.title.toLowerCase()} tasks`}
                      message="Tasks added here will appear in this column."
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTask && editState ? (
        <div className="modal d-block task-modal" tabIndex="-1" role="dialog" aria-modal="true" style={{ background: "rgba(3, 9, 18, .55)" }} onClick={() => { setSelectedTask(null); setEditState(null); }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document" onClick={(event) => event.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <div className="badge text-bg-light mb-2">Task details</div>
                  <h5 className="modal-title mb-0">{selectedTask.title}</h5>
                </div>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => { setSelectedTask(null); setEditState(null); }} />
              </div>
              <div className="modal-body">
                <div className="task-badge-row mb-3">
                  <span className={`badge ${selectedTask.priority === "High" ? "text-bg-danger" : selectedTask.priority === "Low" ? "text-bg-success" : "text-bg-warning"}`}>{selectedTask.priority}</span>
                  <span className="badge text-bg-dark">{selectedTask.status}</span>
                  {selectedTask.dueDate ? <span className="badge text-bg-light">Due {new Date(selectedTask.dueDate).toLocaleDateString()}</span> : null}
                </div>

                {!isAdmin ? <div className="task-note mb-3">You can update the status and add a note. Other fields are locked for members.</div> : null}

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Title</label>
                    <input
                      className="form-control"
                      value={editState.title || ""}
                      onChange={(e) => setEditState({ ...editState, title: e.target.value })}
                      disabled={!isAdmin}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={editState.status || "Todo"}
                      onChange={(e) => setEditState({ ...editState, status: e.target.value })}
                    >
                      <option value="Todo">Todo</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editState.description || ""}
                      onChange={(e) => setEditState({ ...editState, description: e.target.value })}
                      disabled={!isAdmin}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={editState.priority || "Medium"}
                      onChange={(e) => setEditState({ ...editState, priority: e.target.value })}
                      disabled={!isAdmin}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Due date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editState.dueDate || ""}
                      onChange={(e) => setEditState({ ...editState, dueDate: e.target.value })}
                      disabled={!isAdmin}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Assignee</label>
                    <select
                      className="form-select"
                      value={editState.assignedTo || ""}
                      onChange={(e) => setEditState({ ...editState, assignedTo: e.target.value })}
                      disabled={!isAdmin}
                    >
                      <option value="">Choose user</option>
                      {assignees.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Comment / note</label>
                    <input
                      className="form-control"
                      value={editState.comment || ""}
                      onChange={(e) => setEditState({ ...editState, comment: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={() => { setSelectedTask(null); setEditState(null); }}>
                  Close
                </button>
                <button type="button" className="btn btn-dark" onClick={saveTask} disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TaskList;