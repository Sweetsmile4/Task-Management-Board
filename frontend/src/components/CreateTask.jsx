import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function CreateTask({
  boardId,
  members = [],
  onTaskCreated,
}) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!assignedTo && members.length > 0) {
      const self = members.find((member) => member._id === user?._id);
      setAssignedTo((self || members[0])?._id || "");
    }
  }, [members, assignedTo, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post(
        `/boards/${boardId}/tasks`,
        {
          title,
          description,
          priority,
          dueDate: dueDate || undefined,
          assignedTo,
        }
      );

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");

      onTaskCreated();
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Task creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-4 board-summary-card">
      <div className="card-body">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
          <div>
            <div className="badge text-bg-light mb-2">New task</div>
            <h2 className="h5 mb-1">Create Task</h2>
            <p className="page-muted mb-0">Add work to this board and choose who should own it.</p>
          </div>
          <span className="badge text-bg-dark">{members.length} assignable users</span>
        </div>

        {error ? <div className="alert alert-danger py-2">{error}</div> : null}

        <form onSubmit={handleSubmit} className="row g-3 align-items-end">
          <div className="col-12 col-md-6">
            <label className="form-label">Task title</label>
            <input
              className="form-control"
              placeholder="Write a clear task name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Assignee</label>
            <select
              className="form-select"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
            >
              <option value="">Assign to...</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} {member._id === user?._id ? "(you)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Give enough context for the person assigned"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Due date</label>
            <input
              className="form-control"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-4 d-grid">
            <button className="btn btn-dark" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;