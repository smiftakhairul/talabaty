import { Fragment, useEffect, useRef, useState } from "react";
import Footer from "../partials/footer";
import Header from "../partials/header";
import NavHeader from "../partials/nav-header";
import Navbar from "../partials/navbar";
import PreLoader from "../partials/pre-loader";
import loadjs from "loadjs";
import CheckAuth from "../../../utils/middleware/check-auth";
import AddMenu from "./add-menu";
import Categories from "./categories";
import useApi from "../../../hooks/useApi";
import { closeModal, prepareFormFields, slugify } from "../../../utils/helpers/common";
import { useRecoilValue } from "recoil";
import { userStateAtom } from "../../../utils/states/common";
import useNotification from "../../../hooks/useNotification";
import moment from "moment/moment";

const Menu = () => {
  const api = useApi();
  const notification = useNotification();
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [modalMenu, setModalMenu] = useState(null);
  const imageInputRef = useRef(null);
  const userState = useRecoilValue(userStateAtom);

  useEffect(() => {
    // loadjs('/js/custom.js', () => {});
    // loadjs('/js/dlabnav-init.js', () => {});
    // loadjs('/vendor/swiper//js/swiper-bundle.min.js', () => {});
    // loadjs('/js/demo.js', () => {});
    // loadjs('/js/styleSwitcher.js', () => {});
  })

  useEffect(() => {
    getMenus();
    getCategories();
  }, [])

  const getCategories = () => {
    api
      .categories()
      .then(res => {
        if (res?.status === 200 && res?.data) {
          setCategories(res?.data);
        }
      })
  }

  const getMenus = (page = 1) => {
    const user = JSON.parse(localStorage.getItem('user'));
    api
      .menus(user?.id, page)
      .then(res => {
        if (res?.status === 200 && res?.data) {
          setMenus(res?.data);
        }
      })
  }

  const addMenu = (e, type = 'add') => {
    e.preventDefault();
    let formData = prepareFormFields(type === 'add' ? 'addMenuForm' : 'editMenuForm');
    console.log(formData);
    const form = new FormData();
    form.append('user', userState?.id);
    form.append('category', formData?.category);
    form.append('name', formData?.name);
    form.append('description', formData?.description);
    form.append('price', formData?.price);
    form.append('discount_price', formData?.discount_price);
    form.append('slug', slugify(formData?.name));
    form.append('uid', modalMenu?.uid || (new Date()).getTime());
    form.append('status', formData?.status);
    form.append('is_favorite', formData?.is_favorite);
    form.append('is_featured', formData?.is_featured);

    const files = imageInputRef.current.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        form.append('profile_images', files[i]);
      }
    }

    type === 'add' && api
      .addMenu(form)
      .then(res => {
        if (res?.status === 201 && res?.data) {
          getMenus();
          notification.success('Item added successfully');
          closeModal('addMenuModal');
          document.getElementById('addMenuForm').reset();
          setModalMenu(null);
        }
      })

    type === 'edit' && api
      .updateMenu(form, modalMenu?.id)
      .then(res => {
        if (res?.status === 200 && res?.data) {
          getMenus();
          notification.success('Item updated successfully');
          closeModal('addMenuModal');
          document.getElementById('editMenuForm').reset();
          setModalMenu(null);
        }
      })
  }

  const deleteMenu = (menuId) => {
    const result = window.confirm('Are you sure you want to delete?');
    if (result) {
      api
        .deleteMenu(menuId)
        .then(res => {
          getMenus();
          notification.success('Item deleted successfully.')
        })
    } else {
      console.log('canceled');
    }
  }

  const getPaginator = () => {
    return <>{menus?.total_pages > 1 && <div className="d-flex align-items-center justify-content-xl-between justify-content-center flex-wrap pagination-bx">
      <div className="mb-sm-0 mb-3 pagination-title">
        {/* <p className="mb-0"><span>Showing 1-5</span> from <span>100</span> data</p> */}
      </div>
      <nav>
        <ul className="pagination pagination-gutter">
          {menus?.previous && <li className="page-item page-indicator" onClick={() => getMenus(menus?.current_page - 1)}>
            <a className="page-link" href="#" onClick={(e) => e.preventDefault()}>
              <i className="la la-angle-left"></i></a>
          </li>}
          {
            Array.from({ length: menus?.total_pages }, (_, index) => {
              return <li key={index} className={"page-item " + (menus?.current_page === index+1 ? 'active' : '')} onClick={() => getMenus(index + 1)}>
                <a className="page-link" href="#" onClick={(e) => e.preventDefault()}>{index + 1}</a>
              </li>
            })
          }
          {menus?.next && <li className="page-item page-indicator" onClick={() => getMenus(menus?.current_page + 1)}>
            <a className="page-link" href="#" onClick={(e) => e.preventDefault()}>
              <i className="la la-angle-right"></i></a>
          </li>}
        </ul>
      </nav>
    </div>}</>
  }

  const menuModal = () => {
    return <>
      <div className="modal fade" id={"addMenuModal"} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">{!modalMenu ? 'Add Menu' : 'Update Menu'}</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form action="#" id={!modalMenu ? "addMenuForm" : 'editMenuForm'} encType="multipart/form-data" onSubmit={(e) => {if(!modalMenu) addMenu(e); else addMenu(e, 'edit')}}>
          <div className="modal-body">
          
            <div className="modal-inside">
              <label htmlFor="exampleInputText" className="form-label">Item Category</label>
              <select name="category" id="" className="form-control" required>
                <option value="">Select category</option>
                {
                  categories.map((item, index) => {
                    return <option selected={!modalMenu ? false : (modalMenu?.category?.id === item?.id)} value={item.id} key={index}>{item.name}</option>
                    // return <option value={item.id} key={index}>{item.name}</option>
                  })
                }
              </select>
            </div>

            <div className="modal-inside">
              <label htmlFor="exampleInputText" className="form-label">Item Title</label>
              <input type="text" name="name" className="form-control" id="exampleInputText" placeholder="" defaultValue={modalMenu?.name} required />
            </div>
            
            <div className="modal-inside">
              <label htmlFor="exampleInputText" className="form-label">Item Description</label>
              <input type="text" name="description" className="form-control" id="exampleInputText" placeholder="" defaultValue={modalMenu?.description} required />
              {/* <textarea name="description" className="form-control h-auto" id="" cols="30" rows="3" defaultValue={modalMenu?.description} required></textarea> */}
            </div>

            <div className="row">
              <div className="col-xl-6">
                <div className="modal-inside">
                  <label htmlFor="exampleInputnumber" className="form-label mb-2">Item Pricing</label>
                  <input type="text" name="price" className="form-control" id="exampleInputnumber" defaultValue={modalMenu?.price} required />
                </div>
              </div>
              <div className="col-xl-6">
                <div className="modal-inside">
                  <label htmlFor="exampleInputnumber-1" className="form-label mb-2">Discount Price</label>
                  <input type="text" name="discount_price" className="form-control" id="exampleInputnumber-1" defaultValue={modalMenu?.discount_price || 0} required />
                </div>
              </div>
            </div>
            <div className="modal-inside">
              <label htmlFor="exampleInputnumber-3" className="form-label mb-2">Status</label>
              <select name="status" className="form-control" id="" defaultValue={modalMenu?.status} required>
                <option selected={!modalMenu ? false : modalMenu?.status} value="1">Active</option>
                <option selected={!modalMenu ? false : !modalMenu?.status} value="0">Inactive</option>
              </select>
            </div>
            
            <div className="d-flex align-items-center veg justify-content-center">
              <div className="form-check me-3 ">
                <input className="form-check-input" type="checkbox" defaultChecked={!modalMenu ? false : modalMenu?.is_favorite} name="is_favorite" id="flexRadioDefault1" />
                <label className="form-check-label" htmlFor="flexRadioDefault1">Favorite</label>
              </div>
              <div className="form-check style-1">
                <input className="form-check-input" type="checkbox" defaultChecked={!modalMenu ? false : modalMenu?.is_featured} name="is_featured" id="flexRadioDefault2" />
                <label className="form-check-label" htmlFor="flexRadioDefault2">Featured</label>
              </div>
            </div>
            <div className="modal-inside">
              <label htmlFor="exampleInputEmail1" className="form-label mb-2">Item Images</label>
              <input type="file" name="profileImages" className="form-control" id="exampleInputEmail1" ref={imageInputRef} required multiple />
            </div>
          
          </div>
          <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="submit" className="btn btn-primary">Save changes</button>
          </div>
          </form>
        </div>
        </div>
      </div>
    </>
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
              <div className="col-xl-12">
                <AddMenu setModalMenu={setModalMenu} />
                {/* <Categories /> */}
              </div>

              <div className="col-lg-12">
              <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade" id="pills-list" role="tabpanel" aria-labelledby="pills-list-tab">
                  <div className="card h-auto">
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-list i-table style-1 mb-4 border-0" id="guestTable-all3">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Menu</th>
                              <th>Description</th>
                              <th>Price</th>
                              <th>Discount Price</th>
                              <th>Category</th>
                              <th>Favorite</th>
                              <th>Featured</th>
                              <th>Status</th>
                              <th>Created At</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {menus?.results?.map((menu, index) => {
                              return <tr className={(index + 1 === menus?.results?.length) ? "dlab-table-bottom-line" : ''} key={index}>
                                <td><b>{index + 1}</b></td>
                                <td>
                                  <div className="media-bx d-flex py-3  align-items-center">
                                    <img className="me-3 rounded-circle" src={menu?.profile_images?.length && menu?.profile_images[0]} alt="images" />
                                    <div>
                                      <h5 className="mb-0">{menu?.name}</h5>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <p className="mb-0">{menu?.description}</p>
                                  </div>
                                </td>
                                <td>IQD {menu?.price}</td>
                                <td>IQD {menu?.discount_price}</td>
                                <td>{menu?.category?.name}</td>
                                <td>
                                  <span className="badge badge-sm light badge-info">{menu?.is_favorite ? 'Yes' : 'No'}</span>
                                </td>
                                <td>
                                  <span className="badge badge-sm light badge-info">{menu?.is_featured ? 'Yes' : 'No'}</span>
                                </td>
                                <td>
                                  <span className={`badge badge-sm light badge-${menu?.status ? 'success' : 'danger'}`}>{menu?.status ? 'Active' : 'Inactive'}</span>
                                </td>
                                <td>{menu?.created_at ? moment(menu?.created_at).fromNow() : ''}</td>
                                <td>
                                  <div className="dropdown dropstart">
                                    <a href="#" onClick={(e) => e.preventDefault()} className="btn-link" data-bs-toggle="dropdown" aria-expanded="false">
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                      </svg>
                                    </a>
                                    <div className="dropdown-menu">
                                      <a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#addMenuModal" onClick={() => setModalMenu(menu)}>Edit</a>
                                      <a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault(); deleteMenu(menu?.id)}}>Delete</a>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {getPaginator()}
                </div>
                <div className="tab-pane fade active show" id="pills-grid" role="tabpanel" aria-labelledby="pills-grid-tab">
                  <div className="row">
                    {
                      menus?.results?.map((menu, index) => {
                        return <Fragment key={index}>
                          <div className="col-xl-3 col-xxl-4 col-sm-6">
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
                                  {/* <div className="plus c-pointer">
                                    <div className="sub-bx">
                                    </div>
                                  </div> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Fragment>
                      })
                    }
                    
                    {getPaginator()}
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>

      {menuModal()}
    </>
  );
}
 
export default Menu;