import React, { useEffect, useState } from "react";
import "./fabric.css";
import fabricValidation from "../../validations/fabricValidation";
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
  CancelButton,
  PreviousButton,
  NextButton,
} from "../../components/Common/Button";

const Fabric = () => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { fabrics, loading, error } = useSelector((state) => state.fabric);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentFabrics = fabrics.slice(indexOfFirst, indexOfLast);

  const totalPages =
    fabrics.length > 0 ? Math.ceil(fabrics.length / itemsPerPage) : 1;

  const [fabricName, setFabricName] = useState("");
  const [fabricCode, setFabricCode] = useState("");

  const [editId, setEditId] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = fabricValidation({
      fabricName,
      fabricCode,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const fabricData = {
      fabricName,
      fabricCode,
    };

    if (editId) {
      dispatch(
        updateFabric({
          id: editId,
          fabricData,
        }),
      ).then(() => {
        dispatch(getFabrics());
        setEditId("");
        setFabricName("");
        setFabricCode("");
        setShowModal(false);
      });

      setEditId("");
    } else {
      dispatch(createFabric(fabricData));
    }

    setFabricName("");
    setFabricCode("");
  };

  // Edit
  const handleEdit = (fabric) => {
    setEditId(fabric._id);
    setFabricName(fabric.fabricName);
    setFabricCode(fabric.fabricCode);
    setShowModal(true);
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

        <AddButton
          onClick={() => {
            setEditId("");
            setFabricName("");
            setFabricCode("");
            setShowModal(true);
          }}
        >
          Add Fabric
        </AddButton>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editId ? "Update Fabric" : "Add Fabric"}</h2>

            <form className="fabric-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Fabric Name"
                value={fabricName}
                onChange={(e) => setFabricName(e.target.value)}
              />
              {errors.fabricName && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {errors.fabricName}
                </p>
              )}
              <input
                type="text"
                placeholder="Fabric Code"
                value={fabricCode}
                onChange={(e) => setFabricCode(e.target.value)}
              />
              {errors.fabricCode && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {errors.fabricCode}
                </p>
              )}
              <div className="modal-buttons">
                <button type="submit">{editId ? "Update" : "Create"}</button>

                <CancelButton
                  onClick={() => {
                    setShowModal(false);
                    setEditId("");
                    setFabricName("");
                    setFabricCode("");
                  }}
                >
                  Cancel
                </CancelButton>
              </div>
            </form>
          </div>
        </div>
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
