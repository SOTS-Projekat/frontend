import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; // Import icon
import classes from "./Navigation.module.scss";
import { useSession } from "../../hooks/useSession";

export default function Navigation() {
  const navigate = useNavigate();

  const { logout, user } = useSession();

  const username = user?.sub;
  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate("/");
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
          <NavLink
            to="knowledge-domain"
            className={({ isActive }) => (isActive ? classes.active : "")}
          >
            Knowledge Domain
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
