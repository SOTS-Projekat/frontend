import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; // Import icon
import classes from "./Navigation.module.scss";
import { getDecodedToken } from "../../hooks/authUtils";

export default function Navigation() {
  const navigate = useNavigate();

  const decodedToken = getDecodedToken();
  const username = decodedToken?.sub;
  const role = decodedToken?.role;

  const handleLogout = () => {
    localStorage.setItem("session", JSON.stringify(""));
    localStorage.removeItem("token"); 
    navigate("");
  };

  return (
    <header className={classes.header}>
      <div className={classes["left-container"]}>
        {username && <p className={classes.username}>Username: {username}</p>}
        {role && <p className={classes.role}>Role: {role}</p>} 
      </div>
      <nav className={classes.nav}>
        <ul>
          <NavLink
            to="home"
            className={({ isActive }) => (isActive ? classes.active : "")}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="test"
            className={({ isActive }) => (isActive ? classes.active : "")}
          >
            Test
          </NavLink>
          <div>
            <div className={classes.background} />
            <div className={classes.footer} />
          </div>
        </ul>
      </nav>
      <div className={classes["right-container"]}>
        <button onClick={handleLogout} className={classes.logoutButton}>
          <FiLogOut size={22} /> 
        </button>
      </div>
    </header>
  );
}
