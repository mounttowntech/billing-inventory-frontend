import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "./Header.css";

// Placeholder user — replace with data from your auth/user slice
const CURRENT_USER = {
  name: "Manojkumar B.R",
  role: "Employee",
  avatarUrl: "", // if you have a real photo URL, drop it here
};

const BhBellIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.73 21a2 2 0 0 1-3.46 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BhChevronIcon = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`bh-chevron-icon ${open ? "bh-chevron-open" : ""}`}
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BhUserIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 21a8 8 0 1 0-16 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const BhKeyIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M10.8 12.2 20 3M20 3h-3.5M20 3v3.5M16.5 8.5 18.5 10.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BhLogoutIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 17l5-5-5-5M21 12H9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const initials = CURRENT_USER.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="bh-header">
      <h3 className="bh-title-page">Billing Inventory</h3>

      <div className="bh-actions">
        <button
          className="bh-icon-btn"
          type="button"
          aria-label="Notifications"
        >
          <BhBellIcon />
        </button>

        <div className="bh-profile-menu" ref={menuRef}>
          <button
            className={`bh-profile-trigger ${menuOpen ? "bh-profile-trigger-active" : ""}`}
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <span className="bh-avatar">
              {CURRENT_USER.avatarUrl ? (
                <img src={CURRENT_USER.avatarUrl} alt="" />
              ) : (
                initials
              )}
            </span>
            <span className="bh-profile-text">
              <span className="bh-profile-name">{CURRENT_USER.name}</span>
              <span className="bh-profile-role">{CURRENT_USER.role}</span>
            </span>
            <BhChevronIcon open={menuOpen} />
          </button>

          {menuOpen && (
            <div className="bh-dropdown" role="menu">
              <button
                className="bh-dropdown-item"
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
              >
                <span className="bh-dropdown-icon">
                  <BhUserIcon />
                </span>
                <span className="bh-dropdown-text">
                  <span className="bh-dropdown-label">My Profile</span>
                  <span className="bh-dropdown-subtext">
                    View &amp; edit your info
                  </span>
                </span>
              </button>

              <button
                className="bh-dropdown-item"
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/change-password");
                }}
              >
                <span className="bh-dropdown-icon">
                  <BhKeyIcon />
                </span>
                <span className="bh-dropdown-text">
                  <span className="bh-dropdown-label">Change Password</span>
                  <span className="bh-dropdown-subtext">
                    Update your credentials
                  </span>
                </span>
              </button>

              <div className="bh-dropdown-divider" />

              <button
                className="bh-dropdown-item bh-dropdown-item-danger"
                type="button"
                role="menuitem"
                onClick={handleLogout}
              >
                <span className="bh-dropdown-icon bh-dropdown-icon-danger">
                  <BhLogoutIcon />
                </span>
                <span className="bh-dropdown-text">
                  <span className="bh-dropdown-label">Logout</span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
