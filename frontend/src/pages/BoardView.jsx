import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import CreateTask from "../components/CreateTask";
import TaskList from "../components/TaskList";

function BoardView() {
  const { id } = useParams();
  const { isAdmin } = useAuth();

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignees, setAssignees] = useState([]);

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const fetchBoard = async () => {
    try {
      setLoading(true);

      const [boardRes, usersRes] = await Promise.all([
        api.get(`/boards/${id}`),
        isAdmin ? api.get("/users") : Promise.resolve(null),
      ]);

      const nextBoard = boardRes.data.data;
      setBoard(nextBoard);
      setAssignees(isAdmin ? (usersRes?.data?.data || []) : (nextBoard.members || []));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Removed manual refresh - React Query handles it with polling

  if (loading || !board) {
    return <div className="container py-5">Loading board...</div>;
  }

  return (
    <div className="container py-4 py-md-5 page-shell">
      <div className="page-hero mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <div className="badge text-bg-light text-dark mb-3">Board view</div>
            <h1 className="display-6 mb-2">{board.title}</h1>
            <p className="mb-0" style={{ color: "rgba(255,255,255,.82)" }}>
              {board.description || "No description"}
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <span className="badge text-bg-light text-dark">Members: {board.members?.length || 0}</span>
            <span className="badge text-bg-light text-dark">Owner: {board.owner?.name || "-"}</span>
          </div>
        </div>
      </div>

      <CreateTask
        boardId={id}
        members={assignees}
        onTaskCreated={() => {}}
      />

      <TaskList boardId={id} assignees={assignees} />
    </div>
  );
}

export default BoardView;