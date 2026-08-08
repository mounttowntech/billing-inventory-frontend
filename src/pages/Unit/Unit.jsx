import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "../../components/Common/SearchBox";
import {
  getUnits,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../../features/unit/unitSlice";

import {
  AddButton,
  EditButton,
  DeleteButton,
  PreviousButton,
  NextButton,
} from "../../components/Common/Button";

import UnitForm from "./UnitForm";
import Modal from "../../components/Common/Modal";
import "./Unit.css";

const Unit = () => {
  const { units, isLoading } = useSelector((state) => state.unit);
  const dispatch = useDispatch();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editingUnit, setEditingUnit] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  const filteredData = units.filter((unit) =>
    unit.name.toLowerCase().includes(search.toLowerCase()),
  );

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentUnits = filteredData.slice(indexOfFirst, indexOfLast);

  const totalPages =
    filteredData.length > 0 ? Math.ceil(filteredData.length / rowsPerPage) : 1;

  useEffect(() => {
    dispatch(getUnits());
  }, [dispatch]);

  const handleFormSubmit = (data) => {
    if (editId) {
      dispatch(
        updateUnit({
          id: editId,
          unitData: data,
        }),
      ).then(() => {
        dispatch(getUnits());
        setEditId(null);
        setEditingUnit(null);
        setShowForm(false);
      });
    } else {
      dispatch(createUnit(data)).then(() => {
        dispatch(getUnits());
        setShowForm(false);
      });
    }
  };

  const handleEdit = (unit) => {
    setEditId(unit._id);
    setEditingUnit(unit);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setEditingUnit(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setEditingUnit(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Unit?")) {
      dispatch(deleteUnit(id)).then(() => {
        dispatch(getUnits());
      });
    }
  };

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div>
      <div className="unit-header">
        <h2>Unit Management</h2>
        <AddButton onClick={handleAdd}>Add </AddButton>
      </div>

      <div className="unit-container">
        <div className="table-toolbar">
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
          </div>
          <div style={{ marginLeft: "auto" }}>
            <SearchBox
              placeholder="Search Unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="unit-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Unit Name</th>
                <th>Short Name</th>
                <th>Allow Decimal</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentUnits?.length > 0 ? (
                currentUnits.map((unit, index) => (
                  <tr key={unit._id}>
                    <td>{index + 1}</td>
                    <td>{unit.name}</td>
                    <td>{unit.shortName}</td>
                    <td>{unit.allowDecimal ? "Yes" : "No"}</td>
                    <td>{unit.description}</td>

                    <td className="action-buttons">
                      <EditButton onClick={() => handleEdit(unit)} />
                      <DeleteButton onClick={() => handleDelete(unit._id)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No Units Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal
          open={showForm}
          title={editId ? "Edit Unit" : "Add Unit"}
          size="md"
          onClose={() => handleCancel(false)}
        >
          <UnitForm
            unit={editingUnit}
            editId={editId}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>

        <div className="user-pagination">
          <p>
            Showing {filteredData.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredData.length)}
            of {filteredData.length} entries
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

export default Unit;
