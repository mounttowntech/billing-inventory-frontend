import React from "react";
import "./Button.css";

export const AddButton = ({ children, onClick, type = "button" }) => {
  return (
    <button type={type} className="btn btn-add" onClick={onClick}>
      {children}
    </button>
  );
};

export const EditButton = ({ children = "Edit", onClick }) => {
  return (
    <button type="button" className="btn btn-edit" onClick={onClick}>
      {children}
    </button>
  );
};

export const DeleteButton = ({ children = "Delete", onClick }) => {
  return (
    <button type="button" className="btn btn-delete" onClick={onClick}>
      {children}
    </button>
  );
};

export const CancelButton = ({ children = "Cancel", onClick }) => {
  return (
    <button type="button" className="btn btn-cancel" onClick={onClick}>
      {children}
    </button>
  );
};

export const SaveButton = ({ children = "Save", type = "submit", onClick }) => {
  return (
    <button type={type} className="btn btn-save" onClick={onClick}>
      {children}
    </button>
  );
};

export const PreviousButton = ({
  children = "Previous",
  onClick,
  disabled = false,
}) => (
  <button
    type="button"
    className="btn btn-pagination"
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export const NextButton = ({
  children = "Next",
  onClick,
  disabled = false,
}) => (
  <button
    type="button"
    className="btn btn-pagination"
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
