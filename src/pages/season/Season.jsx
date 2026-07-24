import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Season.css";
import {
  getSeasons,
  createSeason,
  updateSeason,
  deleteSeason,
} from "../../features/season/seasonSlice";
import SearchBox from "../../components/Common/SearchBox";
import {
  AddButton,
  EditButton,
  DeleteButton,
  PreviousButton,
  NextButton,
} from "../../components/Common/Button";
import SeasonForm from "./SeasonForm";

const Season = () => {
  const dispatch = useDispatch();
  const { seasons, loading, error } = useSelector((state) => state.season);

  const [editId, setEditId] = useState("");
  const [editingSeason, setEditingSeason] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSeasons = seasons.slice(indexOfFirst, indexOfLast);

  const totalPages =
    seasons.length > 0 ? Math.ceil(seasons.length / itemsPerPage) : 1;

  const [search, setSearch] = useState("");

  const filteredSeasons = currentSeasons.filter((season) =>
    season.seasonName.toLowerCase().includes(search.toLowerCase()),
  );

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

  const handleFormSubmit = (seasonData) => {
    if (editId) {
      dispatch(
        updateSeason({
          id: editId,
          seasonData,
        }),
      ).then(() => {
        dispatch(getSeasons());
        setEditId("");
        setEditingSeason(null);
        setShowModal(false);
      });
    } else {
      dispatch(createSeason(seasonData)).then(() => {
        dispatch(getSeasons());
        setShowModal(false);
      });
    }
  };

  const handleEdit = (season) => {
    setEditId(season._id);
    setEditingSeason(season);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditId("");
    setEditingSeason(null);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditId("");
    setEditingSeason(null);
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
    <div className="season-container">
      <div className="season-header">
        <h2>Season Management</h2>
      </div>
      <div className="season-actions">
        <SearchBox
          placeholder="Search Fabric..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton onClick={handleAdd}>Add Season</AddButton>
      </div>
      <br />
      <br />

      {showModal && (
        <SeasonForm
          season={editingSeason}
          editId={editId}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      <table border="1" cellPadding="10" className="season-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Season Name</th>
            <th>Season Code</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredSeasons.length > 0 ? (
            filteredSeasons.map((season, index) => (
              <tr key={season._id}>
                <td>{indexOfFirst + index + 1}</td>
                <td>{season.seasonName}</td>
                <td>{season.seasonCode}</td>

                <td className="action-buttons">
                  <EditButton onClick={() => handleEdit(season)}>
                    Edit
                  </EditButton>

                  <DeleteButton onClick={() => handleDelete(season._id)}>
                    Delete
                  </DeleteButton>
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
        <PreviousButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </PreviousButton>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <NextButton
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </NextButton>
      </div>
    </div>
  );
};

export default Season;
