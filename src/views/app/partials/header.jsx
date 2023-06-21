import { Fragment, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { cartStateAtom, isLoggedInStateAtom, userStateAtom } from "../../../utils/states/common";
import { Link, useNavigate } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper";
import 'swiper/css';
import 'swiper/css/autoplay';
import useNotification from "../../../hooks/useNotification";

const Header = () => {
  const api = useApi();
  const navigate = useNavigate();
  const setIsLoggedInState = useSetRecoilState(isLoggedInStateAtom);
  const [userState, setUserState] = useRecoilState(userStateAtom);
  const [searchMenus, setSearchMenus] = useState([]);
  const notification = useNotification();
  const [cartState, setCartState] = useRecoilState(cartStateAtom);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedInState(false);
    setUserState(null);
    navigate('/login');
  }

  const getSearchMenus = (keyword) => {
    api
      .getSearchMenus(keyword)
      .then(res => {
        if (res?.data) {
          setSearchMenus(res?.data);
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
    setSearchMenus([]);
  };

  return (
    <>
      <div className="header">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="container d-block my-0">
              <div className="d-flex align-items-center justify-content-sm-between justify-content-end">


                <div className="header-left">
                  <div className="nav-item d-flex align-items-center">
                    <div className="d-flex header-bx active">									
                      
                      <div className="input-group search-area2 ps-3" id="Serach-bar">
                        <span className="input-group-text h-search"><a href="#" onClick={(e) => e.preventDefault()}><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.3" d="M16.6751 19.4916C16.2195 19.036 16.2195 18.2973 16.6751 17.8417C17.1307 17.3861 17.8694 17.3861 18.325 17.8417L22.9917 22.5084C23.4473 22.964 23.4473 23.7027 22.9917 24.1583C22.5361 24.6139 21.7974 24.6139 21.3417 24.1583L16.6751 19.4916Z" fill="var(--primary)"></path>
                        <path d="M12.8333 18.6667C16.055 18.6667 18.6666 16.055 18.6666 12.8333C18.6666 9.61168 16.055 7 12.8333 7C9.61163 7 6.99996 9.61168 6.99996 12.8333C6.99996 16.055 9.61163 18.6667 12.8333 18.6667ZM12.8333 21C8.32297 21 4.66663 17.3437 4.66663 12.8333C4.66663 8.32301 8.32297 4.66667 12.8333 4.66667C17.3436 4.66667 21 8.32301 21 12.8333C21 17.3437 17.3436 21 12.8333 21Z" fill="var(--primary)"></path>
                        </svg>
                        </a></span>
                        <input type="text" className="form-control" placeholder="What do you want eat today" onChange={(e) => getSearchMenus(e.target.value)} />
                        
                      </div>
                      {searchMenus.length > 0 && <div className="search-drop">
                        <div className="card tag-bx">
                          <div className="card-body">
                            <h4>Search Results</h4>
                            <Swiper
                              spaceBetween={10}
                              slidesPerView={4}
                              onSlideChange={() => console.log('slide change')}
                              onSwiper={(swiper) => console.log(swiper)}
                              autoplay={{
                                delay: 2500,
                                // disableOnInteraction: false,
                              }}
                              modules={[Autoplay]}
                            >
                              {searchMenus?.map((menu, index) => {
                                return <div className="custom-search-menus" key={index}>
                                  <SwiperSlide onClick={() => addMenuToCart(menu, menu?.user)} key={index}>
                                    {/* <div className="swiper-slide swiper-slide-prev" style={{width: '172.5px', marginRight: '20px'}}> */}
                                      <div className="card mb-0">
                                        <div className="card-body pb-2 pt-3">
                                          <div className="text-center pop-cousin">
                                            <img src={menu?.profile_images?.length && menu?.profile_images[0]} alt="" />
                                            <a href="#" onClick={(e) => e.preventDefault()}><h6>{menu?.name}</h6></a>
                                          </div>
                                        </div>
                                      </div>
                                    {/* </div> */}
                                  </SwiperSlide>
                                </div>
                              })}
                            </Swiper>
                          </div>
                        </div>
                        <div id="close-searchbox" className="active"></div>
                      </div>}
                    </div>
                  </div>
                </div>

                <ul className="navbar-nav header-right">
                  <li className="nav-item d-flex align-items-center"></li>
                  <li>
                    <div className="dropdown header-profile2">
                      <a className="nav-link" href="#" onClick={(e) => e.preventDefault()} role="button" data-bs-toggle="dropdown">
                        <div className="header-info2 d-flex align-items-center">
                          <img src={userState?.profile?.profile_image || "/images/avatar.png"} alt="" />
                          <div className="d-flex align-items-center sidebar-info">
                            <div>
                              <h6 className="font-w500 mb-0 ms-2">{userState?.username}</h6>
                            </div>
                            <i className="fas fa-chevron-down"></i>
                          </div>
                        </div>
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link to="/profile" className="dropdown-item ai-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          <span className="ms-2">Profile</span>
                        </Link>
                        {/* <a href="notification.html" className="dropdown-item ai-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" className="svg-main-icon">
                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                              <rect x="0" y="0" width="24" height="24" />
                              <path
                                d="M21,12.0829584 C20.6747915,12.0283988 20.3407122,12 20,12 C16.6862915,12 14,14.6862915 14,18 C14,18.3407122 14.0283988,18.6747915 14.0829584,19 L5,19 C3.8954305,19 3,18.1045695 3,17 L3,8 C3,6.8954305 3.8954305,6 5,6 L19,6 C20.1045695,6 21,6.8954305 21,8 L21,12.0829584 Z M18.1444251,7.83964668 L12,11.1481833 L5.85557487,7.83964668 C5.4908718,7.6432681 5.03602525,7.77972206 4.83964668,8.14442513 C4.6432681,8.5091282 4.77972206,8.96397475 5.14442513,9.16035332 L11.6444251,12.6603533 C11.8664074,12.7798822 12.1335926,12.7798822 12.3555749,12.6603533 L18.8555749,9.16035332 C19.2202779,8.96397475 19.3567319,8.5091282 19.1603533,8.14442513 C18.9639747,7.77972206 18.5091282,7.6432681 18.1444251,7.83964668 Z"
                                fill="var(--primary)"
                              />
                              <circle fill="var(--primary)" opacity="0.3" cx="19.5" cy="17.5" r="2.5" />
                            </g>
                          </svg>
                          <span className="ms-2">Notification </span>
                        </a> */}
                        {/* <a href="setting.html" className="dropdown-item ai-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" className="svg-main-icon">
                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                              <rect x="0" y="0" width="24" height="24" />
                              <path
                                d="M18.6225,9.75 L18.75,9.75 C19.9926407,9.75 21,10.7573593 21,12 C21,13.2426407 19.9926407,14.25 18.75,14.25 L18.6854912,14.249994 C18.4911876,14.250769 18.3158978,14.366855 18.2393549,14.5454486 C18.1556809,14.7351461 18.1942911,14.948087 18.3278301,15.0846699 L18.372535,15.129375 C18.7950334,15.5514036 19.03243,16.1240792 19.03243,16.72125 C19.03243,17.3184208 18.7950334,17.8910964 18.373125,18.312535 C17.9510964,18.7350334 17.3784208,18.97243 16.78125,18.97243 C16.1840792,18.97243 15.6114036,18.7350334 15.1896699,18.3128301 L15.1505513,18.2736469 C15.008087,18.1342911 14.7951461,18.0956809 14.6054486,18.1793549 C14.426855,18.2558978 14.310769,18.4311876 14.31,18.6225 L14.31,18.75 C14.31,19.9926407 13.3026407,21 12.06,21 C10.8173593,21 9.81,19.9926407 9.81,18.75 C9.80552409,18.4999185 9.67898539,18.3229986 9.44717599,18.2361469 C9.26485393,18.1556809 9.05191298,18.1942911 8.91533009,18.3278301 L8.870625,18.372535 C8.44859642,18.7950334 7.87592081,19.03243 7.27875,19.03243 C6.68157919,19.03243 6.10890358,18.7950334 5.68746499,18.373125 C5.26496665,17.9510964 5.02757002,17.3784208 5.02757002,16.78125 C5.02757002,16.1840792 5.26496665,15.6114036 5.68716991,15.1896699 L5.72635306,15.1505513 C5.86570889,15.008087 5.90431906,14.7951461 5.82064513,14.6054486 C5.74410223,14.426855 5.56881236,14.310769 5.3775,14.31 L5.25,14.31 C4.00735931,14.31 3,13.3026407 3,12.06 C3,10.8173593 4.00735931,9.81 5.25,9.81 C5.50008154,9.80552409 5.67700139,9.67898539 5.76385306,9.44717599 C5.84431906,9.26485393 5.80570889,9.05191298 5.67216991,8.91533009 L5.62746499,8.870625 C5.20496665,8.44859642 4.96757002,7.87592081 4.96757002,7.27875 C4.96757002,6.68157919 5.20496665,6.10890358 5.626875,5.68746499 C6.04890358,5.26496665 6.62157919,5.02757002 7.21875,5.02757002 C7.81592081,5.02757002 8.38859642,5.26496665 8.81033009,5.68716991 L8.84944872,5.72635306 C8.99191298,5.86570889 9.20485393,5.90431906 9.38717599,5.82385306 L9.49484664,5.80114977 C9.65041313,5.71688974 9.7492905,5.55401473 9.75,5.3775 L9.75,5.25 C9.75,4.00735931 10.7573593,3 12,3 C13.2426407,3 14.25,4.00735931 14.25,5.25 L14.249994,5.31450877 C14.250769,5.50881236 14.366855,5.68410223 14.552824,5.76385306 C14.7351461,5.84431906 14.948087,5.80570889 15.0846699,5.67216991 L15.129375,5.62746499 C15.5514036,5.20496665 16.1240792,4.96757002 16.72125,4.96757002 C17.3184208,4.96757002 17.8910964,5.20496665 18.312535,5.626875 C18.7350334,6.04890358 18.97243,6.62157919 18.97243,7.21875 C18.97243,7.81592081 18.7350334,8.38859642 18.3128301,8.81033009 L18.2736469,8.84944872 C18.1342911,8.99191298 18.0956809,9.20485393 18.1761469,9.38717599 L18.1988502,9.49484664 C18.2831103,9.65041313 18.4459853,9.7492905 18.6225,9.75 Z"
                                fill="var(--primary)"
                                fillRule="nonzero"
                                opacity="0.3"
                              />
                              <path d="M12,15 C13.6568542,15 15,13.6568542 15,12 C15,10.3431458 13.6568542,9 12,9 C10.3431458,9 9,10.3431458 9,12 C9,13.6568542 10.3431458,15 12,15 Z" fill="var(--primary)" />
                            </g>
                          </svg>
                          <span className="ms-2">Settings </span>
                        </a> */}
                        <a href="#" onClick={(e) => {e.preventDefault(); logout();}} className="dropdown-item ai-icon ms-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
                          <span className="ms-1">Logout </span>
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
 
export default Header;