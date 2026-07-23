import { useEffect, useState } from "react";
import "./Measurement.css";
import { useDispatch, useSelector } from "react-redux";
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
  SaveButton,
  PreviousButton,
  NextButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";
import SearchBox from "../../components/Common/SearchBox";

const Measurement = () => {
  const dispatch = useDispatch();

  const { measurements = [], loading } = useSelector(
    (state) => state.measurement || {},
  );

  const { customers = [] } = useSelector((state) => state.customer || {});

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [measurementData, setMeasurementData] = useState([]);
  const [search, setSearch] = useState("");

  // ================= Pagination =================

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  console.log("measurements is:", measurements);
  const currentMeasurements = measurements.slice(indexOfFirst, indexOfLast);

  const totalPages =
    measurements.length > 0 ? Math.ceil(measurements.length / itemsPerPage) : 1;

  console.log("currentMeasurements is:", measurementData);
  const filteredMeasurements = measurementData.filter((measurement) =>
    measurement.customer?.customerName
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  console.log("filteredMeasurements is:", filteredMeasurements);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(measurementValidation),
  });

  // ================= Load Data =================

  useEffect(() => {
    dispatch(getMeasurements())
      .unwrap()
      .then((result) => {
        console.log("Measurements:", result);
        setMeasurementData(result?.data || []);
        dispatch(getCustomers());
      });
  }, [dispatch]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const onSubmit = async (data) => {
    const measurementData = {
      customer: data.customer,
      chest: Number(data.chest),
      waist: Number(data.waist),
      shoulder: Number(data.shoulder),
      sleeve: Number(data.sleeve),
      neck: Number(data.neck),
      hip: Number(data.hip),
      inseam: Number(data.inseam),
      length: Number(data.length),
      notes: data.notes,
    };

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

      reset();
      setEditingId(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= Edit =================

  const handleEdit = (measurement) => {
    setEditingId(measurement._id);

    reset({
      customer: measurement.customer?._id || "",
      chest: measurement.chest || "",
      waist: measurement.waist || "",
      shoulder: measurement.shoulder || "",
      sleeve: measurement.sleeve || "",
      neck: measurement.neck || "",
      hip: measurement.hip || "",
      inseam: measurement.inseam || "",
      length: measurement.length || "",
      notes: measurement.notes || "",
    });

    setShowModal(true);
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
  console.log("errors is:", errors);
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
        <AddButton
          onClick={() => {
            setEditingId(null);

            reset({
              customer: "",
              chest: "",
              waist: "",
              shoulder: "",
              sleeve: "",
              neck: "",
              hip: "",
              inseam: "",
              length: "",
              notes: "",
            });

            setShowModal(true);
          }}
        >
          + Add Measurement
        </AddButton>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? "Edit Measurement" : "Add Measurement"}</h3>

              <button
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  reset();
                }}
              >
                ×
              </button>
            </div>

            <form className="purchase-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label>Customer</label>

                <select {...register("customer")}>
                  <option value="">Select Customer</option>

                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.customerName} ({customer.phone})
                    </option>
                  ))}
                </select>

                <span>{errors.customer?.message}</span>
              </div>

              <div className="form-group">
                <label>Chest</label>

                <input
                  type="number"
                  placeholder="Chest"
                  {...register("chest")}
                />

                <span>{errors.chest}</span>
              </div>

              <div className="form-group">
                <label>Waist</label>

                <input
                  type="number"
                  placeholder="Waist"
                  {...register("waist")}
                />

                <span>{errors.waist?.message}</span>
              </div>

              <div className="form-group">
                <label>Shoulder</label>

                <input
                  type="number"
                  placeholder="Shoulder"
                  {...register("shoulder")}
                />

                <span>{errors.shoulder?.message}</span>
              </div>

              <div className="form-group">
                <label>Sleeve</label>

                <input
                  type="number"
                  placeholder="Sleeve"
                  {...register("sleeve")}
                />

                <span>{errors.sleeve?.message}</span>
              </div>

              <div className="form-group">
                <label>Neck</label>

                <input type="number" placeholder="Neck" {...register("neck")} />

                <span>{errors.neck?.message}</span>
              </div>

              <div className="form-group">
                <label>Hip</label>

                <input type="number" placeholder="Hip" {...register("hip")} />

                <span>{errors.hip?.message}</span>
              </div>

              <div className="form-group">
                <label>Inseam</label>

                <input
                  type="number"
                  placeholder="Inseam"
                  {...register("inseam")}
                />

                <span>{errors.inseam?.message}</span>
              </div>

              <div className="form-group">
                <label>Length</label>

                <input
                  type="number"
                  placeholder="Length"
                  {...register("length")}
                />

                <span>{errors.length?.message}</span>
              </div>

              <div className="form-group measurement-note">
                <label>Notes</label>

                <textarea
                  rows="4"
                  placeholder="Enter Notes"
                  {...register("notes")}
                />

                <span>{errors.notes?.message}</span>
              </div>

              <SaveButton className="save-btn" type="submit">
                {editingId ? "Update Measurement" : "Save Measurement"}
              </SaveButton>
            </form>
          </div>
        </div>
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
