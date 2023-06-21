import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import useApi from "../../../hooks/useApi";
import useNotification from "../../../hooks/useNotification";
import CheckAuth from "../../../utils/middleware/check-auth";
import { cartStateAtom, userStateAtom } from "../../../utils/states/common";
import Header from "../partials/header";
import NavHeader from "../partials/nav-header";
import Navbar from "../partials/navbar";
import PreLoader from "../partials/pre-loader";

const Shop = () => {
  const api = useApi();
  const {id} = useParams();
  const navigate = useNavigate();
  const notification = useNotification();
  const [shop, setShop] = useState(null);
  const [cartState, setCartState] = useRecoilState(cartStateAtom);
  const [location, setLocation] = useState(null);
  const userState = useRecoilValue(userStateAtom);
  const [showLocationField, setShowLocationField] = useState(false);
  const [remarks, setRemarks] = useState(null);
  const [showNoteField, setShowNoteField] = useState(false);

  useEffect(() => {
    getShop();
  }, [])

  useEffect(() => {
    setLocation(userState?.profile?.location || 'Set Location')
  }, [userState])

  const getShop = () => {
    api
      .shop(id)
      .then(res => {
        if (res.status === 200 && res.data) {
          setShop(res.data);
        }
      })
  }

  const proceedToCheckout = () => {
    if (cartState.length) {
      const uid = (new Date()).getTime();
      let cart = cartState.map(({ name, profile_image, shop_id, ...rest }) => rest);

      let formData = new FormData();
      formData.append('uid', uid);
      formData.append('amount', getTotalCartPrice(true));
      formData.append('delivery_charge', 150)
      formData.append('net_amount', getTotalCartPrice());
      formData.append('shop', id);
      formData.append('customer', userState?.id);
      formData.append('status', 'pending');
      formData.append('location', location);
      formData.append('phone', userState?.phone);
      formData.append('remarks', remarks);
      formData.append('estimated_time', '30 minutes');
      formData.append('order_menus', JSON.stringify(cart));

      api
        .createOrder(formData)
        .then(res => {
          if (res.status === 201) {
            notification.success('Order placed successfully');
            localStorage.removeItem('cart');
            setCartState([]);
            navigate('/orders');
          }
        })
    }
  }

  const getTotalCartPrice = (original = false) => {
    let total = original ? 0 : 150;
  
    cartState.forEach(item => {
      total += item.total_price;
    });
  
    return total;
  };

  const decrementCartMenu = (cartMenu) => {
    const existingMenuIndex = cartState.findIndex(item => item.menu_id === cartMenu.menu_id);
    
    if (existingMenuIndex !== -1) {
      const updatedCartState = [...cartState]; // Create a copy of the cartState array
      const existingMenu = updatedCartState[existingMenuIndex]; // Get the existing menu from the copied array
      
      if (existingMenu.quantity === 1) {
        updatedCartState.splice(existingMenuIndex, 1); // Remove the item from the array
      } else {
        // Create a copy of the existingMenu object and update the quantity and total_price
        const updatedMenu = {
          ...existingMenu,
          quantity: existingMenu.quantity - 1,
          total_price: parseInt(parseFloat(existingMenu.unit_price) * (existingMenu.quantity - 1))
        };
        
        updatedCartState[existingMenuIndex] = updatedMenu; // Replace the existingMenu with the updatedMenu
      }
      localStorage.setItem('cart', JSON.stringify(updatedCartState));
      setCartState(updatedCartState);
    }
  };

  const incrementCartMenu = (cartMenu) => {
    const existingMenuIndex = cartState.findIndex(item => item.menu_id === cartMenu.menu_id);
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
    setCartState(updatedCartState);
  }

  const addMenuToCart = (menu) => {
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
                {/* {console.log(cartState)} */}
                
                      <div className="row mb-5">
                        <div className="col-md-8">

                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <h4 className=" mb-0 cate-title">{shop?.first_name}</h4>
                            {/* <a href="favorite-menu.html" className="text-primary">View all <i className="fa-solid fa-angle-right ms-2"></i></a> */}
                          </div>
                          <div className="row">
                            {
                              (shop?.menus || []).map((menu, index2) => {
                                return <Fragment key={index2}>
                                  <div className="col-md-4">
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
                                          <div className="plus c-pointer" onClick={() => addMenuToCart(menu)}>
                                            <div className="sub-bx">
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

                        <div className="col-md-4">
                          <div className="row">
                            <div className="col-md-12">


                              <div className="card dlab-bg dlab-position">
                              <div className="card-body pb-2">
                                
                                <div className="bb-border">
                                  <p className="font-w500 text-primary fs-15 mb-2">Your Address</p>
                                  {showLocationField && <div className="form-group mb-2">
                                    <input type="text" placeholder="Your order location" className="form-control" defaultValue={location === 'Set Location' ? '' : location} onChange={(e) => setLocation(e.target.value)} />
                                  </div>}

                                  <div className="d-flex  align-items-center justify-content-between mb-2">
                                    <h4 className="mb-0">
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.46 9.63C20.3196 8.16892 19.8032 6.76909 18.9612 5.56682C18.1191 4.36456 16.9801 3.40083 15.655 2.7695C14.3299 2.13816 12.8639 1.86072 11.3997 1.96421C9.93555 2.06769 8.52314 2.54856 7.3 3.36C6.2492 4.06265 5.36706 4.9893 4.71695 6.07339C4.06684 7.15749 3.6649 8.37211 3.54 9.63C3.41749 10.8797 3.57468 12.1409 4.00017 13.3223C4.42567 14.5036 5.1088 15.5755 6 16.46L11.3 21.77C11.393 21.8637 11.5036 21.9381 11.6254 21.9889C11.7473 22.0397 11.878 22.0658 12.01 22.0658C12.142 22.0658 12.2727 22.0397 12.3946 21.9889C12.5164 21.9381 12.627 21.8637 12.72 21.77L18 16.46C18.8912 15.5755 19.5743 14.5036 19.9998 13.3223C20.4253 12.1409 20.5825 10.8797 20.46 9.63ZM16.6 15.05L12 19.65L7.4 15.05C6.72209 14.3721 6.20281 13.5523 5.87947 12.6498C5.55614 11.7472 5.43679 10.7842 5.53 9.83C5.62382 8.86111 5.93177 7.92516 6.43157 7.08985C6.93138 6.25453 7.61056 5.54071 8.42 5C9.48095 4.29524 10.7263 3.9193 12 3.9193C13.2737 3.9193 14.5191 4.29524 15.58 5C16.387 5.53862 17.0647 6.24928 17.5644 7.08094C18.064 7.9126 18.3733 8.84461 18.47 9.81C18.5663 10.7674 18.4484 11.7343 18.125 12.6406C17.8016 13.5468 17.2807 14.3698 16.6 15.05ZM12 6C11.11 6 10.24 6.26392 9.49994 6.75839C8.75992 7.25286 8.18314 7.95566 7.84255 8.77793C7.50195 9.6002 7.41284 10.505 7.58647 11.3779C7.7601 12.2508 8.18869 13.0526 8.81802 13.682C9.44736 14.3113 10.2492 14.7399 11.1221 14.9135C11.995 15.0872 12.8998 14.9981 13.7221 14.6575C14.5443 14.3169 15.2471 13.7401 15.7416 13.0001C16.2361 12.26 16.5 11.39 16.5 10.5C16.4974 9.30734 16.0224 8.16428 15.1791 7.32094C14.3357 6.4776 13.1927 6.00265 12 6ZM12 13C11.5055 13 11.0222 12.8534 10.6111 12.5787C10.2 12.304 9.87952 11.9135 9.6903 11.4567C9.50109 10.9999 9.45158 10.4972 9.54804 10.0123C9.6445 9.52733 9.88261 9.08187 10.2322 8.73224C10.5819 8.38261 11.0273 8.1445 11.5123 8.04804C11.9972 7.95158 12.4999 8.00109 12.9567 8.1903C13.4135 8.37952 13.804 8.69996 14.0787 9.11108C14.3534 9.5222 14.5 10.0056 14.5 10.5C14.5 11.163 14.2366 11.7989 13.7678 12.2678C13.2989 12.7366 12.663 13 12 13Z" fill="var(--primary)"></path>
                                      </svg>
                                      &nbsp;{location}
                                    </h4>
                                    <a href="#" onClick={(e) => {e.preventDefault(); setShowLocationField(!showLocationField)}} className="btn btn-outline-primary btn-sm change">Change</a>
                                  </div>
                                  {/* <p>Lorem ipsum dolor sit amet, consectetur  elit, sed do eiusmod tempor incididunt. </p> */}
                                  {showNoteField && <textarea className="ms-2 form-control h-auto" cols="30" rows="2" defaultValue={remarks} onChange={(e) => setRemarks(e.target.value)}></textarea>}
                                  {!showNoteField && <p className="ms-2">{remarks}</p>}
                                  <div className="d-flex">
                                    
                                    
                                    <button type="button" className="btn btn-primary mt-2 ms-2 btn-xs" onClick={() => setShowNoteField(!showNoteField)}>
                                      Add Note
                                    </button>
                                  </div>
                                </div>
                                {
                                  cartState?.map((cartItem, index) => {
                                    return <Fragment key={index}>
                                      <div className="order-check d-flex align-items-center my-3">
                                        <div className="dlab-media">
                                          <img src={cartItem?.profile_image} alt="" />
                                        </div>
                                        <div className="dlab-info">
                                          <div className="d-flex align-items-center justify-content-between">
                                            <h4 className="dlab-title"><a href="#" onClick={(e) => e.preventDefault()}>{cartItem?.name}</a></h4>
                                            <h4 className="text-primary ms-2">IQD {cartItem?.total_price}</h4>
                                          </div>
                                          <div className="d-flex align-items-center justify-content-between">
                                            <span>x{cartItem?.quantity}</span>
                                            <div className="quntity">
                                              <button onClick={() => decrementCartMenu(cartItem)}>-</button>
                                              <input type="text" value={cartItem?.quantity} readOnly />
                                              <button onClick={() => incrementCartMenu(cartItem)}>+</button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </Fragment>
                                  })
                                }


                                {cartState.length > 0 && <hr className="my-2 text-primary" style={{opacity: '0.9'}} />}
                              </div>	
                              <div className="card-footer  pt-0 border-0">
                                <div className="d-flex align-items-center justify-content-between">
                                  <p>Delivery Charge</p>
                                  <h4 className="font-w500">IQD 150</h4>
                                </div>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                  <h4 className="font-w500">Total</h4>
                                  <h3 className="font-w500 text-primary">IQD {getTotalCartPrice()}</h3>
                                </div>
                                <a href="#" onClick={(e) => {e.preventDefault(); proceedToCheckout()}} className="btn btn-primary btn-block">Place Order</a>
                              </div>
                            </div>

                            </div>
                          </div>

                        </div>
                      </div>
                 
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
}
 
export default Shop;