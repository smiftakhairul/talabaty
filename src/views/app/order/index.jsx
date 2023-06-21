import { Fragment, useEffect, useState } from "react";
import CheckAuth from "../../../utils/middleware/check-auth";
import Header from "../partials/header";
import NavHeader from "../partials/nav-header";
import Navbar from "../partials/navbar";
import PreLoader from "../partials/pre-loader";
import useApi from "../../../hooks/useApi";
import moment from "moment";
import { ucFirst } from "../../../utils/helpers/common";
import { Link } from "react-router-dom";

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
          let mainOrders = res?.data?.orders?.filter(item => item.status !== 'delivered');
          setTopOrders(mainOrders);
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
              <div className="col-md-12">
              <div className="d-flex align-items-center justify-content-between mb-4">
                  <h4 className=" mb-0 cate-title">Latest Orders</h4>
                  <Link to="/all-orders" className="text-primary">View all <i className="fa-solid fa-angle-right ms-2"></i></Link>
                </div>
              </div>

              {
                topOrders.map((order, index) => {
                  return <Fragment key={index}>
                    {/* <div className="col-xl-4 col-sm-6 sp15">
                      <div className="card h-auto b-hover">
                        <div className="card-body px-3">
                          <div className="text-center">
                            <h4>Order #{order?.uid}</h4>
                            <p>{moment(order?.created_at).fromNow()}</p>
                          </div>
                          <hr />
                          <div>
                            <h4 className="text-center">{order?.shop?.first_name}</h4>
                            <hr/>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span>Delivery Time </span>
                            <h6 className="mb-0">{order?.estimated_time || 'Soon'}</h6>
                          </div>
                          <hr />
                          <div className="order-menu">
                            <h6>Order Menu</h6>
                            {
                              (order?.order_menus || []).map((orderMenu, index2) => {
                                return <Fragment key={index2}>
                                  <div className="d-flex align-items-center mb-2">
                                    <img className="me-2" src={orderMenu?.menu?.profile_images?.length && orderMenu?.menu?.profile_images[0]} alt="" />
                                    <div className="order-items">
                                      <h6 className="font-w600 text-nowrap mb-0"><a href="#" onClick={(e) => e.preventDefault()}>{orderMenu?.menu?.name}</a></h6>
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
                            <a href="#" onClick={(e) => e.preventDefault()} className="btn btn-outline-info bgl-info btn-block ">
                              {
                                {
                                  'pending': 'Order being prepared',
                                }[order?.status] || ucFirst(order?.status)
                              }
                            </a>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    
                    <div className="col-md-12">
                      <div className="card h-auto deliver-order">
                        <div className="card-body">
                          <div className="d-flex align-items-center justify-content-between mb-4">
                            <h4 className="cate-title mb-0">Ongoing Order <span className="ms-2"><img src="/images/loader.gif" height={50} alt="" /></span></h4>
                            {/* <div className="dropdown dropstart">
                              <a href="#" onClick={(e) => e.preventDefault()} className="btn-link" data-bs-toggle="dropdown" aria-expanded="false">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                              </a>
                              <div className="dropdown-menu">
                                <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>Edit</a>
                                <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>Delete</a>
                              </div>
                            </div> */}
                          </div>
                          <div className="row">
                            <div className="col-xl-3 col-xxl-6 col-sm-6  border-right">
                              
                                <div className="mb-md-2">
                                  <h4 className="mb-0">Order #{order?.uid}</h4>
                                  <p className="mb-0">{moment(order?.created_at).fromNow()}</p>
                                </div>
                                <div className="dliver-order-bx d-flex align-items-center">
                                  <img src={order?.customer?.profile?.profile_image || '/images/avatar.png'} className="me-2" alt="" />
                                  <div>
                                    <h6 className="font-w500 text-nowrap">{order?.customer?.first_name}</h6>
                                    <span>User since 2023</span>
                                  </div>
                                </div>
                              
                              <div className="address-bx mt-3">
                                <span className="d-block mb-2 font-w500">Delivery Address</span>
                                <div className="d-flex align-items-center mb-2">
                                  <svg className="me-2" width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M17.4599 8.63006C17.3195 7.16898 16.8031 5.76915 15.9611 4.56688C15.119 3.36462 13.98 2.4009 12.6549 1.76956C11.3298 1.13822 9.86376 0.860785 8.3996 0.964268C6.93543 1.06775 5.52301 1.54863 4.29988 2.36006C3.24908 3.06271 2.36693 3.98936 1.71682 5.07346C1.06672 6.15755 0.664776 7.37217 0.539881 8.63006C0.417363 9.87972 0.574555 11.141 1.00005 12.3223C1.42555 13.5037 2.10868 14.5755 2.99988 15.4601L8.29988 20.7701C8.39284 20.8638 8.50344 20.9382 8.6253 20.989C8.74716 21.0397 8.87787 21.0659 9.00988 21.0659C9.14189 21.0659 9.2726 21.0397 9.39446 20.989C9.51632 20.9382 9.62692 20.8638 9.71988 20.7701L14.9999 15.4601C15.8911 14.5755 16.5742 13.5037 16.9997 12.3223C17.4252 11.141 17.5824 9.87972 17.4599 8.63006ZM13.5999 14.0501L8.99988 18.6501L4.39988 14.0501C3.72197 13.3721 3.20268 12.5524 2.87935 11.6498C2.55601 10.7473 2.43667 9.78426 2.52988 8.83006C2.6237 7.86117 2.93164 6.92522 3.43145 6.08991C3.93126 5.25459 4.61044 4.54077 5.41988 4.00006C6.48083 3.2953 7.72619 2.91936 8.99988 2.91936C10.2736 2.91936 11.5189 3.2953 12.5799 4.00006C13.3869 4.53868 14.0646 5.24935 14.5642 6.081C15.0639 6.91266 15.3732 7.84467 15.4699 8.81007C15.5661 9.76749 15.4483 10.7343 15.1249 11.6406C14.8014 12.5469 14.2805 13.3699 13.5999 14.0501ZM8.99988 5.00006C8.10986 5.00006 7.23984 5.26399 6.49982 5.75845C5.75979 6.25292 5.18302 6.95572 4.84242 7.77799C4.50183 8.60026 4.41271 9.50506 4.58635 10.378C4.75998 11.2509 5.18856 12.0527 5.8179 12.682C6.44724 13.3114 7.24906 13.74 8.12197 13.9136C8.99489 14.0872 9.89969 13.9981 10.722 13.6575C11.5442 13.3169 12.247 12.7402 12.7415 12.0001C13.236 11.2601 13.4999 10.3901 13.4999 9.50006C13.4972 8.3074 13.0223 7.16434 12.1789 6.321C11.3356 5.47766 10.1925 5.00271 8.99988 5.00006ZM8.99988 12.0001C8.50543 12.0001 8.02208 11.8534 7.61096 11.5787C7.19983 11.304 6.8794 10.9136 6.69018 10.4568C6.50096 9.99996 6.45145 9.49729 6.54792 9.01234C6.64438 8.52739 6.88248 8.08193 7.23211 7.7323C7.58175 7.38267 8.0272 7.14456 8.51215 7.0481C8.99711 6.95164 9.49977 7.00115 9.95659 7.19037C10.4134 7.37958 10.8039 7.70002 11.0786 8.11114C11.3533 8.52226 11.4999 9.00561 11.4999 9.50006C11.4999 10.1631 11.2365 10.799 10.7676 11.2678C10.2988 11.7367 9.66292 12.0001 8.99988 12.0001Z" fill="#FC8019"></path>
                                  </svg>
                                  <h5 className="mb-0">{order?.location}</h5>
                                </div>
                                {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. </p> */}

                              </div>
                            </div>
                            <div className="col-xl-3 col-xxl-6 col-sm-6 b-right">
                              <div className="order-menu">
                                <h4 className=" ms-0">Order Menu</h4>
                                {order?.order_menus?.map((orderMenu, index2) => {
                                  return <Fragment key={index2}>
                                    <div className="d-flex align-items-center mb-3 justify-content-xl-center justify-content-start">
                                      <img className="me-2" src={orderMenu?.menu?.profile_images?.length && orderMenu?.menu?.profile_images[0]} alt="" />
                                      <div>
                                        <h6 className="font-w600 text-nowrap mb-0">{orderMenu?.menu?.name}</h6>
                                        <p className="mb-0">x{orderMenu?.quantity}</p>
                                      </div>
                                      <h6 className="text-primary mb-0 ms-auto">IQD {orderMenu?.total_price}</h6>
                                    </div>
                                  </Fragment>
                                })}
                              </div>
                            </div>
                            <div className="col-xl-3 col-xxl-6 col-sm-6 border-right">
                              <div className="px- xl-3 px-0 mb-sm-0 mb-3">
                                <h4 className="mb-0">{order?.shop?.first_name}</h4>
                                {/* <div className="d-flex align-items-center mb-3">
                                  <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8 0.500031L9.79611 6.02789H15.6085L10.9062 9.4443L12.7023 14.9722L8 11.5558L3.29772 14.9722L5.09383 9.4443L0.391548 6.02789H6.20389L8 0.500031Z" fill="#FC8019"></path>
                                  </svg>
                                  <p className="mb-0 px-2">5.0</p>
                                  <svg className="me-2" width="4" height="5" viewBox="0 0 4 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="2" cy="2.50003" r="2" fill="#C4C4C4"></circle>
                                  </svg>
                                  <p className="mb-0">1k+ Reviews</p>
                                </div> */}
                                <p>{order?.shop?.profile?.description}</p>
                                <div className="d-flex align-items-center justify-content-between">
                                  <span className="font-w500">Delivery Time </span>
                                  <h6 className="mb-0 font-w500">{order?.estimated_time}</h6>
                                </div>
                                {/* <div className="d-flex align-items-center justify-content-between">
                                  <span className="font-w500">Distance</span>
                                  <h6 className="mb-0 font-w500">2.5 Km</h6>
                                </div> */}
                              </div>
                            </div>
                            <div className="col-xl-3  col-xxl-6 col-sm-6">
                              <div className="px-sm-0 px-0">
                                <div className="mb-2">
                                  <h4 className="font-w500 del-color">Payment Method</h4>
                                  <h4 className="cate-title">Cash</h4>
                                </div>
                                <div className="mb-2">
                                  <h4 className="cate-title">
                                    <span className={`badge badge-${
                                      {
                                        'pending': 'danger',
                                        'preparing': 'secondary',
                                        'prepared': 'primary',
                                        'delivered to rider': 'info',
                                        'delivered': 'success'
                                      }[order?.status] || 'info'
                                    }`}>{ucFirst(order?.status)}</span>
                                  </h4>
                                </div>
                                <div>
                                  <h4 className="font-w500 del-color">Total</h4>
                                  <h4 className="cate-title text-primary">IQD {order?.net_amount}</h4>
                                </div>
                              </div>
                            </div>
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