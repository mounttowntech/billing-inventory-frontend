import "./Modal.css";

export default function Modal({ open, title, children, onClose, size = "md" }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-container ${size}`}>
        <div className="modal-header">
          <h3>{title}</h3>

          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
