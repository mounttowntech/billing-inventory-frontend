import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "./Header.css";
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="header">
      <h3 className="header-title-page">Billing Inventory</h3>

      <button className="logout-btn-header" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
};

export default Header;
