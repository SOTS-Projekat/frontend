import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; // Import ikone
import classes from "./Navigation.module.scss";

export default function Navigation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("session", JSON.stringify(""));
    localStorage.removeItem("token"); // Clear token from local storage
    navigate("");
  };

  return (
    <header className={classes.header}>
      <div className={classes["left-container"]}></div>
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
          <FiLogOut size={22} /> {/* Modern logout ikona */}
        </button>
      </div>
    </header>
  );
}
