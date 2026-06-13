import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminBoards() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const res = await api.get("/boards");
      setBoards(res.data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load boards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this board and its tasks?")) {
      return;
    }

    await api.delete(`/boards/${id}`);
    fetchBoards();
  };

  return (
    <div className="container py-4 py-md-5 page-shell">
      <div className="page-hero mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-lg-center">
          <div>
            <div className="badge text-bg-light text-dark mb-3">Admin panel</div>
            <h1 className="display-6 mb-2">All Boards</h1>
            <p className="mb-0" style={{ color: "rgba(255,255,255,.82)" }}>
              Monitor every board in the workspace.
            </p>
          </div>
        </div>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}
      {loading ? <div className="text-muted">Loading boards...</div> : null}

      {!loading ? (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Owner</th>
                <th>Members</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {boards.map((board) => (
                <tr key={board._id}>
                  <td>
                    <Link to={`/boards/${board._id}`}>{board.title}</Link>
                  </td>
                  <td>{board.owner?.name || "-"}</td>
                  <td>{board.members?.length || 0}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(board._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

export default AdminBoards;