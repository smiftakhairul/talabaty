import { Fragment, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import useApi from "../../../hooks/useApi";
import useNotification from "../../../hooks/useNotification";
import CheckAuth from "../../../utils/middleware/check-auth";
import { userStateAtom } from "../../../utils/states/common";
import Header from "../partials/header";
import NavHeader from "../partials/nav-header";
import Navbar from "../partials/navbar";
import PreLoader from "../partials/pre-loader";
import { Link } from "react-router-dom";
import moment from "moment";

const AllOrder = () => {
  const api = useApi();
  const notification = useNotification();
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [modalMenu, setModalMenu] = useState(null);
  const imageInputRef = useRef(null);
  const userState = useRecoilValue(userStateAtom);

  useEffect(() => {
    getOrders();
  }, [])

  const getOrders = (page = 1) => {
    const user = JSON.parse(localStorage.getItem('user'));
    api
      .userPaginatedOrders(user?.id, page)
      .then(res => {
        if (res?.status === 200 && res?.data) {
          setOrders(res?.data);
        }
      })
  }

  const getPaginator = () => {
    return <>{orders?.orders?.total_pages > 1 && <div className="d-flex align-items-center justify-content-xl-between justify-content-center flex-wrap pagination-bx">
      <div className="mb-sm-0 mb-3 pagination-title">
        {/* <p className="mb-0"><span>Showing 1-5</span> from <span>100</span> data</p> */}
      </div>
      <nav>
        <ul className="pagination pagination-gutter">
          {orders?.orders?.previous && <li className="page-item page-indicator" onClick={() => getOrders(orders?.orders?.current_page - 1)}>
            <a className="page-link" href="#" onClick={(e) => e.preventDefault()}>
              <i className="la la-angle-left"></i></a>
          </li>}
          {
            Array.from({ length: orders?.orders?.total_pages }, (_, index) => {
              return <li key={index} className={"page-item " + (orders?.orders?.current_page === index+1 ? 'active' : '')} onClick={() => getOrders(index + 1)}>
                <a className="page-link" href="#" onClick={(e) => e.preventDefault()}>{index + 1}</a>
              </li>
            })
          }
          {orders?.orders?.next && <li className="page-item page-indicator" onClick={() => getOrders(orders?.orders?.current_page + 1)}>
            <a className="page-link" href="#" onClick={(e) => e.preventDefault()}>
              <i className="la la-angle-right"></i></a>
          </li>}
        </ul>
      </nav>
    </div>}</>
  }

  return (
    <>
      <CheckAuth />
      <PreLoader />
      <div id="main-wrapper show">
        <NavHeader />
        <Header />
        <Navbar />
        <div className="content-body">
          <div className="container">
            <div className="row mb-5">
                <div className="col-md-12">
                    
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h4 className=" mb-0 cate-title">All Orders</h4>
                  {/* <Link to="/all-orders" className="text-primary">View all <i className="fa-solid fa-angle-right ms-2"></i></Link> */}
                </div>

                </div>
              <div className="col-lg-12">
              <div className="card h-auto">
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-striped i-table style-1 mb-4 border-0" id="guestTable-all3">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Shop</th>
                              <th>Order At</th>
                              <th>Amount</th>
                              <th>Delivery Charge</th>
                              <th>Net Amount</th>
                              <th>Status</th>
                              <th>Order Location</th>
                              <th>Phone</th>
                              <th>Remarks</th>
                              <th>Est. Time</th>
                              <th>Rider</th>
                              <th>Customer</th>
                              <th>Cart</th>
                              {/* <th></th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {
                                orders?.orders?.results?.map((order, index) => {
                                    return <Fragment key={index}>
                                        <tr className={(index + 1 === orders?.orders?.results?.length) ? "dlab-table-bottom-line" : ''}>
                                            <td><b>{index + 1}</b></td>
                                            <td>{order?.shop?.first_name}</td>
                                            <td>{moment(order?.created_at).fromNow()}</td>
                                            <td>{order?.amount}</td>
                                            <td>{order?.delivery_charge}</td>
                                            <td>{order?.net_amount}</td>
                                            <td>
                                                <span className="badge badge-info">{order?.status?.toUpperCase()}</span>
                                            </td>
                                            <td>{order?.location}</td>
                                            <td>{order?.phone}</td>
                                            <td>{order?.remarks}</td>
                                            <td>{order?.estimated_time}</td>
                                            <td>{order?.rider?.first_name}</td>
                                            <td>{order?.customer?.first_name}</td>
                                            <td>
                                                {order?.order_menus?.map((orderMenu, index2) => {
                                                    return <Fragment key={index2}>
                                                        <div className="d-flex align-items-left mb-3 justify-content-xl-left justify-content-start">
                                                        <img className="me-2" src={orderMenu?.menu?.profile_images?.length && orderMenu?.menu?.profile_images[0]} width={30} height={30} alt="" />
                                                        <div>
                                                            <h6 className="font-w600 text-nowrap mb-0">{orderMenu?.menu?.name}</h6>
                                                            <p className="mb-0">x{orderMenu?.quantity} - IQD {orderMenu?.total_price}</p>
                                                        </div>
                                                        </div>
                                                    </Fragment>
                                                })}
                                            </td>
                                        </tr>
                                    </Fragment>
                                })
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {getPaginator()}
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
}
 
export default AllOrder;