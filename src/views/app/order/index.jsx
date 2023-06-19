import { Fragment, useEffect, useState } from "react";
import CheckAuth from "../../../utils/middleware/check-auth";
import Header from "../partials/header";
import NavHeader from "../partials/nav-header";
import Navbar from "../partials/navbar";
import PreLoader from "../partials/pre-loader";
import useApi from "../../../hooks/useApi";
import moment from "moment";
import { ucFirst } from "../../../utils/helpers/common";

const Order = () => {
  const api = useApi();
  const [orders, setOrders] = useState([]);
  const [topOrders, setTopOrders] = useState([])

  useEffect(() => {
    getOrders();
  }, [])

  const getOrders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    api
      .userOrders(user?.id)
      .then(res => {
        if (res.status === 200 && res?.data) {
          setOrders(res?.data?.orders);
          setTopOrders((res?.data?.orders)?.slice(0, 3));
        }
      })
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
            
            <div className="row">
              {
                orders.map((order, index) => {
                  return <Fragment key={index}>
                    <div className="col-xl-4 col-sm-6 sp15">
                      <div className="card h-auto b-hover">
                        <div className="card-body px-3">
                          <div className="text-center">
                            <h4>Order #{order?.uid}</h4>
                            <p>{moment(order?.created_at).fromNow()}</p>
                          </div>
                          <hr />
                          <div>
                            <h4 className="text-center">{order?.shop?.first_name}</h4>
                            {/* <div className="d-flex align-items-center">
                              <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 0.500031L9.79611 6.02789H15.6085L10.9062 9.4443L12.7023 14.9722L8 11.5558L3.29772 14.9722L5.09383 9.4443L0.391548 6.02789H6.20389L8 0.500031Z" fill="#FC8019"></path>
                              </svg>
                              <p className="mb-0 px-2">5.0</p>
                              <svg className="me-2" width="4" height="5" viewBox="0 0 4 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="2" cy="2.50003" r="2" fill="#C4C4C4"></circle>
                              </svg>
                              <p className="mb-0">1k+ Reviews</p>
                            </div> */}
                            <hr/>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span>Delivery Time </span>
                            <h6 className="mb-0">{order?.estimated_time || 'Soon'}</h6>
                          </div>
                          {/* <div className="d-flex align-items-center justify-content-between">
                            <span>Distance</span>
                            <h6 className="mb-0">2.5 Km</h6>
                          </div> */}
                          <hr />
                          <div className="order-menu">
                            <h6>Order Menu</h6>
                            {
                              (order?.order_menus || []).map((orderMenu, index2) => {
                                return <Fragment key={index2}>
                                  <div className="d-flex align-items-center mb-2">
                                    <img className="me-2" src={orderMenu?.menu?.profile_images?.length && orderMenu?.menu?.profile_images[0]} alt="" />
                                    <div className="order-items">
                                      <h6 className="font-w600 text-nowrap mb-0"><a href="javascript:void(0);">{orderMenu?.menu?.name}</a></h6>
                                      <p className="mb-0">x{orderMenu?.quantity}</p>
                                    </div>
                                    <h6 className="text-primary mb-0 ms-auto">IQD {orderMenu?.total_price}</h6>
                                  </div>
                                </Fragment>
                              })
                            }
                            <hr />
                            <div className="d-flex align-items-center justify-content-between mb-4">
                              <h4 className="mb-0">Total</h4>
                              <h4 className="mb-0 text-primary">IQD {order?.net_amount}</h4>
                            </div>
                            <a href="javascript:void(0);" className="btn btn-outline-info bgl-info btn-block ">
                              {
                                {
                                  'pending': 'Order being prepared',
                                }[order?.status] || ucFirst(order?.status)
                              }
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                })
              }

              
            </div>

          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
}
 
export default Order;