import { useEffect, useState } from "react";
import "./Measurement.css";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/Common/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { measurementValidation } from "../../validations/MeasurementValidation";
import {
  getMeasurements,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
} from "../../features/measurement/measurementSlice";

import { getCustomers } from "../../features/customer/customerSlice";

import {
  AddButton,
  PreviousButton,
  NextButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";
import SearchBox from "../../components/Common/SearchBox";
import MeasurementForm from "./MeasurementForm";

const Measurement = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.measurement || {});
  const { customers = [] } = useSelector((state) => state.customer || {});

  const [measurementData, setMeasurementData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getMeasurements())
      .unwrap()
      .then((result) => {
        setMeasurementData(result?.data || []);
        dispatch(getCustomers());
      });
  }, [dispatch]);

  const filteredMeasurements = measurementData.filter((measurement) =>
    measurement.customer?.customerName
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const itemsPerPage = rowsPerPage;
  const totalPages =
    filteredMeasurements.length > 0
      ? Math.ceil(filteredMeasurements.length / itemsPerPage)
      : 1;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentMeasurements = filteredMeasurements.slice(
    indexOfFirst,
    indexOfLast,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(measurementValidation),
  });

  const handleFormSubmit = async (measurementData) => {
    try {
      if (editingId) {
        await dispatch(
          updateMeasurement({
            id: editingId,
            measurement: measurementData,
          }),
        ).unwrap();
      } else {
        await dispatch(createMeasurement(measurementData)).unwrap();
      }

      await dispatch(getMeasurements())
        .unwrap()
        .then((result) => {
          setMeasurementData(result?.data || []);
        });

      setEditingId(null);
      setEditingMeasurement(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Edit

  const handleEdit = (measurement) => {
    setEditingId(measurement._id);
    setEditingMeasurement(measurement);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setEditingMeasurement(null);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingId(null);
    setEditingMeasurement(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this Measurement?")) {
      const result = await dispatch(deleteMeasurement(id));

      if (!result.error) {
        await dispatch(getMeasurements())
          .unwrap()
          .then((result) => {
            setMeasurementData(result?.data || []);
          });
      }
    }
  };

  return (
    <div className="measurement-main">
      <div className="measurement-header">
        <h2>Measurement Management</h2>

        <AddButton onClick={handleAdd}>+ Add Measurement</AddButton>
      </div>

      <div className="measurement-container">
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
              placeholder="Search Measurements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Modal
          open={showModal}
          title={editingId ? "Edit Measurement" : "Add Measurement"}
          size="md"
          onClose={handleCancel}
        >
          <MeasurementForm
            measurement={editingMeasurement}
            editingId={editingId}
            customers={customers}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>

        <div className="table-wrapper">
          <table className="purchase-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Chest</th>
                <th>Waist</th>
                <th>Shoulder</th>
                <th>Sleeve</th>
                <th>Neck</th>
                <th>Hip</th>
                <th>Inseam</th>
                <th>Length</th>
                <th>Notes</th>
                <th className="supplier-column">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : currentMeasurements.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: "center" }}>
                    No Measurements Found
                  </td>
                </tr>
              ) : (
                currentMeasurements.map((measurement) => (
                  <tr key={measurement._id}>
                    <td>{measurementData.indexOf(measurement) + 1}</td>
                    <td>{measurement.customer?.customerName || "-"}</td>
                    <td>{measurement.customer?.phone || "-"}</td>
                    <td>{measurement.chest}</td>
                    <td>{measurement.waist}</td>
                    <td>{measurement.shoulder}</td>
                    <td>{measurement.sleeve}</td>
                    <td>{measurement.neck}</td>
                    <td>{measurement.hip}</td>
                    <td>{measurement.inseam}</td>
                    <td>{measurement.length}</td>
                    <td>{measurement.notes || "-"}</td>

                    <td className="supplier-column">
                      <EditButton onClick={() => handleEdit(measurement)}>
                        Edit
                      </EditButton>

                      <DeleteButton
                        onClick={() => handleDelete(measurement._id)}
                      >
                        Delete
                      </DeleteButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="user-pagination">
          <p>
            Showing {filteredMeasurements.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredMeasurements.length)}
            of {filteredMeasurements.length} entries
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

export default Measurement;
