import { Fragment, useEffect, useState } from "react";
import CheckAuth from "../../../utils/middleware/check-auth";
import Header from "../partials/header";
import NavHeader from "../partials/nav-header";
import Navbar from "../partials/navbar";
import PreLoader from "../partials/pre-loader";
import useApi from "../../../hooks/useApi";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Link } from "react-router-dom";

const Dashboard = () => {
  const api = useApi();
  const [shops, setShops] = useState([]);

  useEffect(() => {
    getShops();
  }, [])

  const getShops = () => {
    api
      .shops()
      .then(res => {
        if (res.status === 200 && res.data) {
          setShops(res.data);
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
                {
                  shops.map((shop, index) => {
                    return <Fragment key={index}>
                      <div className="row">
                        <div className="col-md-12 mb-5">

                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <h4 className=" mb-0 cate-title">{shop?.first_name}</h4>
                            <Link to={"/shop/" + shop?.id} className="text-primary">View all <i className="fa-solid fa-angle-right ms-2"></i></Link>
                          </div>

                          <Swiper
                            spaceBetween={10}
                            slidesPerView={4}
                            onSlideChange={() => console.log('slide change')}
                            onSwiper={(swiper) => console.log(swiper)}
                            navigation={{
                              prevEl: ".swiper-button-prev",
                              nextEl: ".swiper-button-next",
                            }}
                          >
                            {
                              (shop.menus || []).slice(0, 9).map((menu, index2) => {
                                return <Fragment key={index2}>
                                  <SwiperSlide>
                                  <div>
                                    <div className="card dishe-bx b-hover style-1">
                                        {/* <i className="fa-solid fa-heart ms-auto c-heart c-pointer"></i> */}
                                      <div className="card-body pb-0 pt-3">
                                        <div className="text-center mb-2">
                                          <img src={menu?.profile_images?.length && menu?.profile_images[0]} alt="" />
                                        </div>
                                        <div className="border-bottom pb-3">
                                          <h4 className="font-w500 mb-1">{menu?.description}</h4>
                                          {/* <div className="d-flex align-items-center">
                                            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 0.500031L9.79611 6.02789H15.6085L10.9062 9.4443L12.7023 14.9722L8 11.5558L3.29772 14.9722L5.09383 9.4443L0.391548 6.02789H6.20389L8 0.500031Z" fill="#FC8019"></path>
                                            </svg>
                                            <p className="font-w500 mb-0 px-2">5.0</p>
                                            <svg className="me-2" width="4" height="5" viewBox="0 0 4 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="2" cy="2.50003" r="2" fill="#C4C4C4"></circle>
                                            </svg>
                                            <p className=" font-w500 mb-0">1k+ Reviews</p>
                                            <svg className="mx-2" width="4" height="5" viewBox="0 0 4 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="2" cy="2.5" r="2" fill="#C4C4C4"></circle>
                                            </svg>
                                            <p className="font-w500 mb-0">2.97km</p>

                                          </div> */}
                                        </div>
                                      </div>
                                      <div className="card-footer border-0 pt-2">
                                        <div className="common d-flex align-items-center justify-content-between">
                                          <div>
                                            <a href="javascript:void(0);"><h4>{menu?.name}</h4></a>
                                            <h3 className=" mb-0 text-primary">IQD {menu?.price}</h3>
                                          </div>
                                          <div className="plus c-pointer">
                                            <div className="sub-bx">
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  </SwiperSlide>
                                </Fragment>
                              })
                            }
                          </Swiper>
                        </div>
                      </div>
                    </Fragment>
                  })
                }
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
}
 
export default Dashboard;