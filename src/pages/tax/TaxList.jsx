import "./TaxList.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/common/Modal";
import TaxForm from "../tax/TaxForm";
import { getTaxes, deleteTax } from "../../features/tax/taxSlice";
import toaster from "../../utils/toaster";

export default function TaxList() {
  const dispatch = useDispatch();
  const [taxes, setTaxes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [mode, setMode] = useState("add"); // add | edit
  const { taxes: authTaxes } = useSelector((state) => state.tax);

  useEffect(() => {
    dispatch(getTaxes());
  }, [dispatch]);

  useEffect(() => {
    if (authTaxes?.data) {
      setTaxes(authTaxes.data);
    }
  }, [authTaxes]);

  const filteredTaxes = taxes.filter((tax) =>
    `${tax.taxName} ${tax.taxCode}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const indexOfLastTax = currentPage * rowsPerPage;
  const indexOfFirstTax = indexOfLastTax - rowsPerPage;

  const currentTaxes = filteredTaxes.slice(indexOfFirstTax, indexOfLastTax);

  const totalPages = Math.ceil(filteredTaxes.length / rowsPerPage);

  // console.log(taxes);

  const handleDelete = async (tax) => {
    const ok = window.confirm(`Delete ${tax.taxName}?`);

    if (!ok) return;

    await dispatch(deleteTax(tax._id));
    toaster.success("Tax deleted successfully!");
    dispatch(getTaxes());
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Tax Lists</h2>

        <button
          className="btn-primary"
          onClick={() => {
            setMode("add");
            setSelectedTax(null);
            setOpenModal(true);
          }}
        >
          + Add Tax
        </button>
      </div>

      <div className="table-card">
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

          <input
            className="user-search-box"
            placeholder="Search taxes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tax Code</th>
                <th>Tax Name</th>
                <th>Tax Percentage</th>
                <th>Tax Type</th>
                <th>Is Active</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentTaxes.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    No taxes found.
                  </td>
                </tr>
              ) : (
                currentTaxes?.map((tax, index) => (
                  <tr key={tax?._id ?? index}>
                    <td>{indexOfFirstTax + index + 1}</td>

                    <td>{tax?.taxCode}</td>

                    <td>{tax?.taxName}</td>

                    <td>{tax?.taxPercentage}</td>

                    <td>{tax?.taxType}</td>

                    <td>
                      <span className="status active">
                        {tax?.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="action-column">
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setMode("edit");
                            setSelectedTax(tax);
                            setOpenModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(tax)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="user-pagination">
          <p>
            Showing {filteredTaxes.length === 0 ? 0 : indexOfFirstTax + 1}
            to {Math.min(indexOfLastTax, filteredTaxes.length)}
            of {filteredTaxes.length} entries
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

      <Modal
        open={openModal}
        title={mode === "add" ? "Add Tax" : "Edit Tax"}
        size="md"
        onClose={() => setOpenModal(false)}
      >
        <TaxForm
          mode={mode}
          tax={selectedTax}
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            setOpenModal(false);
            dispatch(getTaxes());
          }}
        />
      </Modal>
    </div>
  );
}
