import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./ProfilePage.css";

// Placeholder user — replace with data from your auth/user slice (useSelector)
const INITIAL_USER = {
  name: "Unknown User",
  role: "User",
  employeeId: "EMP-1234",
  // department: "Billing & Inventory",
  email: "test@example.com",
  phone: "+91 98765 43210",
  // joinedOn: "12 Mar 2023",
  // address: "24, Anna Nagar, Salem, Tamil Nadu",
  avatarUrl: "",
};

const BpBackIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BpCameraIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 8a2 2 0 0 1 2-2h1.5l1-1.5h7l1 1.5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const BpMailIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="m4 7 8 6 8-6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BpPhoneIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1.2 1.2 0 0 1 1.2-.3c1.3.4 2.7.6 4.1.6a1.2 1.2 0 0 1 1.2 1.2V20a1.2 1.2 0 0 1-1.2 1.2C11.6 21.2 2.8 12.4 2.8 3.2A1.2 1.2 0 0 1 4 2h3.3a1.2 1.2 0 0 1 1.2 1.2c0 1.4.2 2.8.6 4.1a1.2 1.2 0 0 1-.3 1.2L6.6 10.8Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const BpIdIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle
      cx="8.5"
      cy="11.5"
      r="1.8"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M5.5 16c.6-1.4 1.8-2.2 3-2.2s2.4.8 3 2.2M14 10h5M14 14h5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const BpBuildingIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="4"
      y="3"
      width="10"
      height="18"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M14 8h6v13h-6M7 7h.01M10 7h.01M7 11h.01M10 11h.01M7 15h.01M10 15h.01"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const BpCalendarIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M8 3v4M16 3v4M3 10h18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const BpPinIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const login_user = useSelector((state) => state.auth.user);
  if (login_user) {
    INITIAL_USER.name = login_user?.firstName + " " + login_user?.lastName;
    INITIAL_USER.role = login_user?.role?.roleName || "User";
    INITIAL_USER.avatarUrl = login_user?.avatarUrl || "";
    INITIAL_USER.employeeId = login_user?.employeeCode || "";
    INITIAL_USER.phone = login_user?.phone || "";
    // INITIAL_USER.department = login_user?.department || "";
    // INITIAL_USER.joinedOn = login_user?.joinedOn || "";
    // INITIAL_USER.address = login_user?.address || "";
    INITIAL_USER.email = login_user?.email || "";
  }
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(INITIAL_USER);
  const [savedData, setSavedData] = useState(INITIAL_USER);

  const initials = savedData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleEdit = () => {
    setFormData(savedData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(savedData);
    setIsEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedData(formData);
    setIsEditing(false);
    // TODO: dispatch an update-profile thunk / API call here
  };

  const fields = [
    {
      key: "email",
      label: "Email Address",
      icon: <BpMailIcon />,
      type: "email",
    },
    { key: "phone", label: "Phone Number", icon: <BpPhoneIcon />, type: "tel" },
    {
      key: "employeeId",
      label: "Employee ID",
      icon: <BpIdIcon />,
      type: "text",
      readOnly: true,
    },
    // {
    //   key: "department",
    //   label: "Department",
    //   icon: <BpBuildingIcon />,
    //   type: "text",
    // },
    // {
    //   key: "joinedOn",
    //   label: "Joined On",
    //   icon: <BpCalendarIcon />,
    //   type: "text",
    //   readOnly: true,
    // },
    // { key: "address", label: "Address", icon: <BpPinIcon />, type: "text" },
  ];

  return (
    <div className="bp-page">
      <button
        className="bp-back-btn"
        type="button"
        onClick={() => navigate(-1)}
      >
        <BpBackIcon />
        <span>Back</span>
      </button>

      <div className="bp-card">
        <div className="bp-banner" />

        <div className="bp-header">
          <div className="bp-avatar-wrap">
            <span className="bp-avatar-large">
              {savedData.avatarUrl ? (
                <img src={savedData.avatarUrl} alt="" />
              ) : (
                initials
              )}
            </span>
            {/* {isEditing && (
              <button
                type="button"
                className="bp-avatar-edit-btn"
                aria-label="Change photo"
              >
                <BpCameraIcon />
              </button>
            )} */}
          </div>

          <div className="bp-heading">
            <h2 className="bp-heading-name">{savedData.name}</h2>
            <span className="bp-heading-role">{savedData.role}</span>
          </div>

          {!isEditing && (
            <button type="button" className="bp-edit-btn" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
        </div>

        <form className="bp-form" onSubmit={handleSave}>
          <div className="bp-field bp-field-name">
            <label htmlFor="bp-name">Full Name</label>
            <input
              id="bp-name"
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="bp-grid">
            {fields.map(({ key, label, icon, type, readOnly }) => (
              <div className="bp-field" key={key}>
                <label htmlFor={`bp-${key}`}>{label}</label>
                <div
                  className={`bp-input-wrap ${!isEditing ? "bp-input-wrap-disabled" : ""}`}
                >
                  <span className="bp-input-icon">{icon}</span>
                  <input
                    id={`bp-${key}`}
                    type={type}
                    value={formData[key]}
                    onChange={handleChange(key)}
                    disabled={!isEditing || readOnly}
                  />
                </div>
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="bp-actions">
              <button
                type="button"
                className="bp-btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="bp-btn-primary">
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
