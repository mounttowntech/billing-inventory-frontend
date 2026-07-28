import { useEffect, useState } from "react";
import "./Measurement.css";
import { useDispatch, useSelector } from "react-redux";

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

  const { measurements = [], loading } = useSelector(
    (state) => state.measurement || {},
  );

  const { customers = [] } = useSelector((state) => state.customer || {});

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [measurementData, setMeasurementData] = useState([]);
  const [search, setSearch] = useState("");

  // ================= Pagination =================

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentMeasurements = measurements.slice(indexOfFirst, indexOfLast);

  const totalPages =
    measurements.length > 0 ? Math.ceil(measurements.length / itemsPerPage) : 1;

  const filteredMeasurements = measurementData.filter((measurement) =>
    measurement.customer?.customerName
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // ================= Load Data =================

  useEffect(() => {
    dispatch(getMeasurements())
      .unwrap()
      .then((result) => {
        setMeasurementData(result?.data || []);
        dispatch(getCustomers());
      });
  }, [dispatch]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  // ================= Edit =================

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
    <div className="measurement-container">
      <div className="measurement-header">
        <h2>Measurement Management</h2>
      </div>
      <div className="measurement-actions">
        <SearchBox
          placeholder="Search Measurements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton onClick={handleAdd}>+ Add Measurement</AddButton>
      </div>

      {showModal && (
        <MeasurementForm
          measurement={editingMeasurement}
          editId={editingId}
          customers={customers}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

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
            ) : measurementData.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ textAlign: "center" }}>
                  No Measurements Found
                </td>
              </tr>
            ) : (
              filteredMeasurements.map((measurement) => (
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

                    <DeleteButton onClick={() => handleDelete(measurement._id)}>
                      Delete
                    </DeleteButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <PreviousButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </PreviousButton>

        <span className="page-info">
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

export default Measurement;
