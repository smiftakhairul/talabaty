import { Fragment, useEffect, useState } from "react";
import CheckAuth from "../../../utils/middleware/check-auth";
import Header from "../partials/header";
import NavHeader from "../partials/nav-header";
import Navbar from "../partials/navbar";
import PreLoader from "../partials/pre-loader";
import useApi from "../../../hooks/useApi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper";
import 'swiper/css';
// import 'swiper/css/bundle';
import 'swiper/css/autoplay';
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { cartStateAtom } from "../../../utils/states/common";
import useNotification from "../../../hooks/useNotification";

const Dashboard = () => {
  const api = useApi();
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();
  const notification = useNotification();
  const [cartState, setCartState] = useRecoilState(cartStateAtom);

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

  const addMenuToCart = (menu, shop) => {
    const existingShopIndex = cartState.findIndex(item => item.shop_id === menu?.user?.id);
  
    if (existingShopIndex !== -1) {
      const existingMenuIndex = cartState.findIndex(item => item.menu_id === menu.id);

      if (existingMenuIndex !== -1) {
        const updatedCartState = [...cartState]; // Create a copy of the cartState array
        const existingMenu = updatedCartState[existingMenuIndex]; // Get the existing menu from the copied array
    
        // Create a copy of the existingMenu object and update the quantity and total_price
        const updatedMenu = {
          ...existingMenu,
          quantity: existingMenu.quantity + 1,
          total_price: parseInt(parseFloat(existingMenu.unit_price) * (existingMenu.quantity + 1))
        };
    
        updatedCartState[existingMenuIndex] = updatedMenu; // Replace the existingMenu with the updatedMenu
        localStorage.setItem('cart', JSON.stringify(updatedCartState));
        setCartState(updatedCartState); // Update the cartState with the updated array
        console.log(updatedCartState);
      } else {
        let cartMenu = {
          menu_id: menu?.id,
          name: menu?.name,
          unit_price: menu?.price,
          shop_id: menu?.user?.id,
          quantity: 1,
          profile_image: menu?.profile_images?.length ? menu?.profile_images[0] : null,
        };
        cartMenu.total_price = parseInt(parseFloat(cartMenu.unit_price) * cartMenu.quantity);
    
        localStorage.setItem('cart', JSON.stringify([...cartState, cartMenu]));
        setCartState([...cartState, cartMenu]);
      }
    } else {
      let cartMenu = {
        menu_id: menu?.id,
        name: menu?.name,
        unit_price: menu?.price,
        shop_id: menu?.user?.id,
        quantity: 1,
        profile_image: menu?.profile_images?.length ? menu?.profile_images[0] : null,
      };
      cartMenu.total_price = parseInt(parseFloat(cartMenu.unit_price) * cartMenu.quantity);
  
      localStorage.setItem('cart', JSON.stringify([...cartState, cartMenu]));
      setCartState([cartMenu]);
    }

    notification.success('Item added to cart.');
    navigate('/shop/' + shop?.id);
  };

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
                    return <div className="db-menu" key={index}>
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
                            navigation={true}
                            autoplay={{
                              delay: 2500,
                              // disableOnInteraction: false,
                            }}
                            modules={[Autoplay]}
                          >
                            {
                              (shop.menus || []).slice(0, 9).map((menu, index2) => {
                                return <div className="db-nsf-meu" key={index2+'.'+index}>
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
                                            <a href="#" onClick={(e) => e.preventDefault()}><h4>{menu?.name}</h4></a>
                                            <h3 className=" mb-0 text-primary">IQD {menu?.price}</h3>
                                          </div>
                                          <div className="plus c-pointer" onClick={() => addMenuToCart(menu, shop)}>
                                            <div className="sub-bx">
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  </SwiperSlide>
                                </div>
                              })
                            }
                          </Swiper>
                        </div>
                      </div>
                    </div>
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