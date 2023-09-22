import { Link} from "react-router-dom";
import {Global} from "../../Auth/UserStatas";
import React, {useState} from "react";

export const Navbar = () => {
  const [isAuthorised, setisAuthorised] = useState(Global.isAuthorised);
  const logoutClicked = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    (Global.isAuthorised as any) = false;
    setisAuthorised(Global.isAuthorised);
    (Global.currentUserId as any) = "";
    (Global.currentUserType as any) = "";
  }

  return (
    <nav className="navbar navbar-expand-md navbar-dark main-color">
      <div className="container-fluid">
        <span className="navbar-brand">
          <Link className="nav-link" to="/home">
            <img
              src={require("./../../images/App-logos/medi-help-logo-no-bg.png")}
              height="50"
              alt="Logo"
            />
          </Link>
        </span>

        <form className="d-flex flex-grow-1">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button className="btn btn-outline-dark" type="submit">
            Search
          </button>
        </form>

        <button
          className="navbar-toggler m-1"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            {isAuthorised?
                <li className="nav-item m-1">
                  <button type="button" className="btn btn-outline-dark" onClick={logoutClicked}>
                    Logout
                  </button>
                </li>
                :
                <li className="nav-item m-1">
                  <Link type="button" className="btn btn-outline-dark" to='/login'>
                    Sign in
                  </Link>
                </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
};
