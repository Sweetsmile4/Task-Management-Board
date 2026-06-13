import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api, { boardsQueryKey } from "../services/api";

function CreateBoard({ onBoardCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/boards", {
        title,
        description,
      });

      setTitle("");
      setDescription("");

      // Invalidate boards cache to trigger refetch
      queryClient.invalidateQueries({ queryKey: [boardsQueryKey] });
      onBoardCreated();
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Failed to create board"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 board-summary-card">
      <div className="card-body">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
          <div>
            <div className="badge text-bg-light mb-2">Admin control</div>
            <h2 className="h5 mb-1">Create Board</h2>
            <p className="page-muted mb-0">Set up a new workspace lane and invite the right people to it.</p>
          </div>
          <span className="badge text-bg-dark align-self-start align-self-lg-center">Admin only</span>
        </div>

        {error ? <div className="alert alert-danger py-2">{error}</div> : null}

        <form onSubmit={handleSubmit} className="row g-3 align-items-end">
          <div className="col-12 col-md-5">
            <label className="form-label">Board title</label>
            <input
              className="form-control"
              placeholder="Sprint planning, Product, Support..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="col-12 col-md-5">
            <label className="form-label">Description</label>
            <input
              className="form-control"
              placeholder="Optional summary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-2 d-grid">
            <button className="btn btn-dark" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBoard;