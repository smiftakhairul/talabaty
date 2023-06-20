import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();

    return (
      <>
        <div className="dlabnav border-right">
          <div className="dlabnav-scroll">
            <p className="menu-title style-1">Main Menu</p>
            <ul className="metismenu" id="menu">
              <li className={location.pathname === '/dashboard' ? 'mm-active' : ''}>
                <Link to="/dashboard" aria-expanded="false">
                  <i className="bi bi-grid"></i>
                  <span className="nav-text">Browse Foods</span>
                </Link>
              </li>
              <li className={location.pathname === '/orders' ? 'mm-active' : ''}>
                <Link to="/orders" aria-expanded="false">
                  <i className="bi bi-bicycle"></i>
                  <span className="nav-text">Ongoing Orders</span>
                </Link>
              </li>
              <li className={location.pathname === '/all-orders' ? 'mm-active' : ''}>
                <Link to="/all-orders" aria-expanded="false">
                  <i className="bi bi-shop-window"></i>
                  <span className="nav-text">All Orders</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
}
 
export default Navbar;