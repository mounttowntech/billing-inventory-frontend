import React, { useEffect, useState } from "react";
import "./fabric.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getFabrics,
  createFabric,
  updateFabric,
  deleteFabric,
} from "../../features/fabric/fabricSlice";
import SearchBox from "../../components/Common/SearchBox";
import {
  AddButton,
  EditButton,
  DeleteButton,
  PreviousButton,
  NextButton,
} from "../../components/Common/Button";
import FabricForm from "./FabricForm";

const Fabric = () => {
  const dispatch = useDispatch();
  const { fabrics, loading, error } = useSelector((state) => state.fabric);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentFabrics = fabrics.slice(indexOfFirst, indexOfLast);

  const totalPages =
    fabrics.length > 0 ? Math.ceil(fabrics.length / itemsPerPage) : 1;

  const [editId, setEditId] = useState("");
  const [editingFabric, setEditingFabric] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filteredFabrics = currentFabrics.filter((fabric) =>
    fabric.fabricName.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    dispatch(getFabrics());
  }, [dispatch]);

  useEffect(() => {
    if (
      currentPage > Math.ceil(fabrics.length / itemsPerPage) &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
    }
  }, [fabrics, currentPage]);

  // Create & Update
  const handleFormSubmit = (fabricData) => {
    if (editId) {
      dispatch(
        updateFabric({
          id: editId,
          fabricData,
        }),
      ).then(() => {
        dispatch(getFabrics());
        setEditId("");
        setEditingFabric(null);
        setShowModal(false);
      });
    } else {
      dispatch(createFabric(fabricData));
    }
  };

  // Edit
  const handleEdit = (fabric) => {
    setEditId(fabric._id);
    setEditingFabric(fabric);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditId("");
    setEditingFabric(null);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditId("");
    setEditingFabric(null);
  };

  // Delete
  const handleDelete = (id) => {
    dispatch(deleteFabric(id));
    alert("Are you sure you want to delete this fabric?");
  };

  if (loading) return <h2>Loading...</h2>;

  if (error) return <h2>{error}</h2>;

  return (
    <div className="fabric-container">
      <h2 className="fabric-title">Fabric Management</h2>
      <div className="fabric-actions">
        <SearchBox
          placeholder="Search Fabric..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <AddButton onClick={handleAdd}>Add Fabric</AddButton>
      </div>

      {showModal && (
        <FabricForm
          fabric={editingFabric}
          editId={editId}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      <div className="fabric-card">
        {fabrics.length === 0 ? (
          <h3>No Fabrics Found</h3>
        ) : (
          <table className="fabric-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Fabric Name</th>
                <th>Fabric Code</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredFabrics.map((fabric, index) => (
                <tr key={fabric._id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{fabric.fabricName}</td>
                  <td>{fabric.fabricCode}</td>

                  <td className="action-buttons">
                    <EditButton onClick={() => handleEdit(fabric)}>
                      Edit
                    </EditButton>

                    <DeleteButton onClick={() => handleDelete(fabric._id)}>
                      Delete
                    </DeleteButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
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

export default Fabric;
