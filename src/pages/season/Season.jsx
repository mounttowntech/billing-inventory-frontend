import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSeasons,
  createSeason,
  updateSeason,
  deleteSeason,
} from "../../features/season/seasonSlice";
import seasonValidation from "../../validations/seasonValidation";

const Season = () => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { seasons, loading, error } = useSelector((state) => state.season);

  const [seasonName, setSeasonName] = useState("");
  const [seasonCode, setSeasonCode] = useState("");

  const [editId, setEditId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSeasons = seasons.slice(indexOfFirst, indexOfLast);

  const totalPages =
    seasons.length > 0 ? Math.ceil(seasons.length / itemsPerPage) : 1;
  useEffect(() => {
    dispatch(getSeasons());
  }, [dispatch]);
  useEffect(() => {
    if (
      currentPage > Math.ceil(seasons.length / itemsPerPage) &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
    }
  }, [seasons, currentPage]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = seasonValidation({
      seasonName,
      seasonCode,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const seasonData = {
      seasonName,
      seasonCode,
    };

    if (editId) {
      dispatch(
        updateSeason({
          id: editId,
          seasonData,
        }),
      ).then(() => {
        dispatch(getSeasons());
        setEditId("");
        setSeasonName("");
        setSeasonCode("");
        setShowModal(false);
      });
    } else {
      dispatch(createSeason(seasonData)).then(() => {
        dispatch(getSeasons());
        setSeasonName("");
        setSeasonCode("");
        setShowModal(false);
      });
    }
  };
  const handleEdit = (season) => {
    setEditId(season._id);
    setSeasonName(season.seasonName);
    setSeasonCode(season.seasonCode);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this season?")) {
      dispatch(deleteSeason(id)).then(() => {
        dispatch(getSeasons());
      });
    }
  };

  if (loading) return <h2>Loading...</h2>;

  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <div className="season-header">
        <h2>Season Management</h2>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditId("");
            setSeasonName("");
            setSeasonCode("");
            setShowModal(true);
          }}
        >
          Add Season
        </button>
      </div>
      <br />
      <br />
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editId ? "Update Season" : "Add Season"}</h2>

            <form onSubmit={handleSubmit} className="season-form">
              <input
                type="text"
                placeholder="Season Name"
                value={seasonName}
                onChange={(e) => setSeasonName(e.target.value)}
              />
              {errors.seasonName && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {errors.seasonName}
                </p>
              )}
              <input
                type="text"
                placeholder="Season Code"
                value={seasonCode}
                onChange={(e) => setSeasonCode(e.target.value)}
              />
              {errors.seasonCode && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {errors.seasonCode}
                </p>
              )}
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">
                  {editId ? "Update" : "Create"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditId("");
                    setSeasonName("");
                    setSeasonCode("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Season Name</th>
            <th>Season Code</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentSeasons.length > 0 ? (
            currentSeasons.map((season, index) => (
              <tr key={season._id}>
                <td>{indexOfFirst + index + 1}</td>

                <td>{season.seasonName}</td>

                <td>{season.seasonCode}</td>

                <td>
                  <button onClick={() => handleEdit(season)}>Edit</button>

                  <button onClick={() => handleDelete(season._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No Seasons Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Season;
