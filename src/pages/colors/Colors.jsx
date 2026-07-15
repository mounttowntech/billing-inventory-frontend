import React, { useState } from "react";

const initialColors = [
  { id: 1, name: "Red", hex: "#FF0000", rgb: "255,0,0" },
  { id: 2, name: "Green", hex: "#00FF00", rgb: "0,255,0" },
  { id: 3, name: "Blue", hex: "#0000FF", rgb: "0,0,255" },
];

function Colors() {
  const [colors, setColors] = useState(initialColors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#");
  const [rgb, setRgb] = useState("");

  const openModal = () => {
    setName("");
    setHex("#");
    setRgb("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !hex.trim() || !rgb.trim()) {
      return;
    }

    const newColor = {
      id: colors.length ? colors[colors.length - 1].id + 1 : 1,
      name: name.trim(),
      hex: hex.trim(),
      rgb: rgb.trim(),
    };

    setColors([...colors, newColor]);
    closeModal();
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <h1 style={styles.title}>Colors</h1>
        <button style={styles.addButton} type="button" onClick={openModal}>
          Add Color
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Hex</th>
            <th style={styles.th}>RGB</th>
            <th style={styles.th}>Preview</th>
          </tr>
        </thead>
        <tbody>
          {colors.map((color) => (
            <tr key={color.id}>
              <td style={styles.td}>{color.name}</td>
              <td style={styles.td}>{color.hex}</td>
              <td style={styles.td}>{color.rgb}</td>
              <td style={styles.td}>
                <div style={{ ...styles.swatch, backgroundColor: color.hex }} />
              </td>
            </tr>
          ))}
          {colors.length === 0 && (
            <tr>
              <td style={styles.emptyCell} colSpan="4">
                No colors available. Add a new color to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add Color</h2>
              <button
                style={styles.closeButton}
                type="button"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label} htmlFor="color-name">
                Name
              </label>
              <input
                id="color-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Color name"
                style={styles.input}
                required
              />

              <label style={styles.label} htmlFor="color-hex">
                Hex
              </label>
              <input
                id="color-hex"
                type="text"
                value={hex}
                onChange={(event) => setHex(event.target.value)}
                placeholder="#000000"
                pattern="^#([A-Fa-f0-9]{6})$"
                style={styles.input}
                required
              />

              <label style={styles.label} htmlFor="color-rgb">
                RGB
              </label>
              <input
                id="color-rgb"
                type="text"
                value={rgb}
                onChange={(event) => setRgb(event.target.value)}
                placeholder="255,255,255"
                pattern="^\d{1,3},\d{1,3},\d{1,3}$"
                style={styles.input}
                required
              />

              <div style={styles.modalActions}>
                <button style={styles.submitButton} type="submit">
                  Save Color
                </button>
                <button
                  style={styles.cancelButton}
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    color: "#222",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  title: {
    margin: 0,
  },
  addButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
  },
  th: {
    textAlign: "left",
    borderBottom: "2px solid #e0e0e0",
    padding: "12px 10px",
  },
  td: {
    padding: "12px 10px",
    borderBottom: "1px solid #f0f0f0",
    verticalAlign: "middle",
  },
  emptyCell: {
    padding: "24px 10px",
    textAlign: "center",
    color: "#666",
  },
  swatch: {
    width: "32px",
    height: "24px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    padding: "24px",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  modalTitle: {
    margin: 0,
    fontSize: "18px",
  },
  closeButton: {
    background: "transparent",
    border: "none",
    fontSize: "24px",
    lineHeight: 1,
    cursor: "pointer",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "12px",
  },
  submitButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    color: "#333",
    border: "none",
    padding: "10px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Colors;
