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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import fabricValidation from "../../validations/fabricValidation";
import Modal from "../../components/Common/Modal";

const Fabric = () => {
  const dispatch = useDispatch();
  const { fabrics, loading, error } = useSelector((state) => state.fabric);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const itemsPerPage = rowsPerPage;
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(fabricValidation),
  });

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
  const handleFormSubmit = async (fabricData) => {
    try {
      if (editId) {
        await dispatch(
          updateFabric({
            id: editId,
            fabricData,
          }),
        ).unwrap();
      } else {
        await dispatch(createFabric(fabricData)).unwrap();
      }

      await dispatch(getFabrics());

      setEditId("");
      setEditingFabric(null);
      setShowModal(false);
    } catch (err) {
      console.log(err);
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
    <div className="Fabric-main-page">
      <div className="fabric-actions">
        <h2 className="fabric-title">Fabric Management</h2>
        <AddButton
          onClick={() => {
            (reset(), setEditId(null));
            setShowModal(true);
          }}
        >
          Add
        </AddButton>
      </div>

      <div className="fabric-container">
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
              placeholder="Search Fabric..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Modal
          open={showModal}
          title={editId ? "Edit Fabric" : "Add Fabric"}
          size="md"
          onClose={() => setShowModal(false)}
        >
          <FabricForm
            fabric={editingFabric}
            editId={editId}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>

        <div className="fabric-card">
          {fabrics.length === 0 ? (
            <h3>No Fabrics Found</h3>
          ) : (
            <div className="table-wrapper">
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
            </div>
          )}
        </div>

        <div className="user-pagination">
          <p>
            Showing {filteredFabrics.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredFabrics.length)}
            of {filteredFabrics.length} entries
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

export default Fabric;
