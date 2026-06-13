import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api, { boardsQueryKey } from "../services/api";

function BoardList() {
  const [page, setPage] = useState(1);

  const { data: boardsData = {}, isLoading, error, refetch } = useQuery({
    queryKey: [boardsQueryKey],
    queryFn: async () => {
        const res = await api.get("/boards");
        console.log("Boards API Response:", res.data);
        let baseBoards = [];
        // Handle multiple possible response formats
        if (Array.isArray(res.data)) {
            baseBoards = res.data;
        } else if (Array.isArray(res.data?.data)) {
            baseBoards = res.data.data;
        } else if (Array.isArray(res.data?.boards)) {
            baseBoards = res.data.boards;
        } else if (Array.isArray(res.data?.data?.boards)) {
            baseBoards = res.data.data.boards;
        }

        const boardsWithCounts = await Promise.all(
            baseBoards.map(async (board) => {
            try {
                const taskRes = await api.get(
                `/boards/${board._id}/tasks?limit=1&page=1`
                );
                return {
                ...board,
                taskCount:
                    taskRes.data?.totalCount ||
                    taskRes.data?.count ||
                    taskRes.data?.data?.totalCount ||
                    0,
                };
            } catch {
                return {
                ...board,
                taskCount: 0,
                };
            }
            })
        );

        return boardsWithCounts;
        },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 30,
  });

  const boards = Array.isArray(boardsData)
  ? boardsData
  : [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">Boards</h2>
        <div className="d-flex gap-2 align-items-center">
          <span className="text-muted small">
            {Array.isArray(boards) ? boards.length : 0} total
        </span>
          <button className="btn btn-sm btn-outline-dark" onClick={() => refetch()} title="Refresh boards">
            ↻
          </button>
        </div>
      </div>

      {error ? <div className="alert alert-danger">{error?.response?.data?.message || "Failed to load boards"}</div> : null}
      {isLoading ? <div className="text-muted">Loading boards...</div> : null}

      {!isLoading && boards.length === 0 ? (
        <div className="empty-state">
          <h4>No boards yet</h4>
          <p className="page-muted mb-0">Create the first board to start organizing tasks and members.</p>
        </div>
      ) : null}

      <div className="row g-3 mt-0">
        {boards.map((board) => (
          <div className="col-12 col-md-6 col-xl-4" key={board._id}>
            <div className="card h-100 shadow-sm border-0 board-summary-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <span className="badge text-bg-light mb-2">Board</span>
                    <h3 className="h5 mb-1">
                      <Link to={`/boards/${board._id}`} className="text-decoration-none text-dark board-card-link">
                        {board.title}
                      </Link>
                    </h3>
                    <p className="page-muted mb-0">{board.description || "No description"}</p>
                  </div>
                </div>

                <div className="board-stats pt-3 border-top">
                  <span className="board-stat">{board.members?.length || 0} members</span>
                  <span className="board-stat">{board.taskCount ?? 0} tasks</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardList;