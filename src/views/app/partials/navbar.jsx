import { Link } from "react-router-dom";

const Navbar = () => {
    return (
      <>
        <div className="dlabnav border-right">
          <div className="dlabnav-scroll">
            <p className="menu-title style-1">Main Menu</p>
            <ul className="metismenu" id="menu">
              <li>
                <Link to="/dashboard" aria-expanded="false">
                  <i className="bi bi-grid"></i>
                  <span className="nav-text">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/orders" aria-expanded="false">
                  <i className="bi bi-shop-window"></i>
                  <span className="nav-text">Orders</span>
                </Link>
              </li>
              {/* <li>
                <a className="has-arrow" href="#" onClick={(e) => e.preventDefault()} aria-expanded="false">
                  <i className="bi bi-shop-window"></i>
                  <span className="nav-text">My Shop</span>
                </a>
                <ul aria-expanded="false">
                  <li><Link to="/menus">Menu</Link></li>
                  <li><Link to="orders.html">Orders</Link></li>
                  <li><Link to="customer-reviews.html">Reviews</Link></li>
                </ul>
              </li> */}
            </ul>
          </div>
        </div>
      </>
    );
}
 
export default Navbar;