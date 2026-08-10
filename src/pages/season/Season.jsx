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
} from "../../components/Common/Button";
import SeasonForm from "./SeasonForm";
import Modal from "../../components/common/Modal";

const Season = () => {
  const dispatch = useDispatch();
  const { seasons, loading, error } = useSelector((state) => state.season);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const itemsPerPage = rowsPerPage;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSeasons = seasons.slice(indexOfFirst, indexOfLast);

  const totalPages =
    seasons.length > 0 ? Math.ceil(seasons.length / itemsPerPage) : 1;

  const [editId, setEditId] = useState("");
  const [editingSeason, setEditingSeason] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");

  const filteredSeasons = currentSeasons.filter((season) =>
    season.seasonName.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    console.log("showModal:", showModal);
  }, [showModal]);

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

  const handleFormSubmit = async (seasonData) => {
    try {
      console.log("Before Create");
      if (editId) {
        await dispatch(
          updateSeason({
            id: editId,
            seasonData,
          }),
        ).unwrap();
      } else {
        await dispatch(createSeason(seasonData)).unwrap();
      }
      console.log("After Create");
      await dispatch(getSeasons());
      console.log("Closing Modal");
      setShowModal(false);
      setEditId("");
      setEditingSeason(null);
    } catch (err) {
      console.log(err);
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
    <div className="season-main-page">
      <div className="season-header">
        <h2>Season Management</h2>
        <AddButton onClick={handleAdd}>Add </AddButton>
      </div>

      <div className="season-container">
        <div className="entries">
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>

          <span>Entries</span>
          <div style={{ marginLeft: "auto" }}>
            <SearchBox
              placeholder="Search Season..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <br />
        <br />

        <Modal
          open={showModal}
          title={editId ? "Edit Season" : "Add Season"}
          size="md"
          onClose={handleCancel}
        >
          <SeasonForm
            season={editingSeason}
            editId={editId}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>

        <div className="table-wrapper">
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

                    <td className="modal-buttons">
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
        </div>

        <div className="user-pagination">
          <p>
            Showing {filteredSeasons.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredSeasons.length)}
            of {filteredSeasons.length} entries
          </p>

          <div className="page-buttons">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              &laquo;
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              &lsaquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              &rsaquo;
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Season;
