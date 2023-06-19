import { useEffect, useRef, useState } from "react";
import CheckAuth from "../../../utils/middleware/check-auth";
import PreLoader from "../partials/pre-loader";
import NavHeader from "../partials/nav-header";
import Header from "../partials/header";
import Navbar from "../partials/navbar";
import loadjs from "loadjs";
import useApi from "../../../hooks/useApi";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userStateAtom } from "../../../utils/states/common";
import { prepareFormFields } from "../../../utils/helpers/common";
import { useNavigate } from "react-router-dom";
import useNotification from "../../../hooks/useNotification";

const UpdateProfile = () => {
  const api = useApi();
  const navigate = useNavigate();
  const notification = useNotification();
  const userState = useRecoilValue(userStateAtom);
  const [profile, setProfile] = useState(null);
  const profileInputRef = useRef();
  const bannerInputRef = useRef();
  const setUserState = useSetRecoilState(userStateAtom);

  useEffect(() => {
    loadjs('/js/custom.js', () => {});
  })

  useEffect(() => {
    userState?.id && api
      .profile(userState?.id)
      .then(res => {
        if (res?.status === 200 && res?.data) {
          setProfile(res?.data);
        }
      })
  }, [userState])

  const updateProfile = (e) => {
    e.preventDefault();
    const formData = prepareFormFields('updateProfileForm');

    const userForm = new FormData();
    formData?.first_name && userForm.append('first_name', formData?.first_name);
    formData?.email && userForm.append('email', formData?.email);
    formData?.username && userForm.append('username', formData?.username);
    formData?.password && userForm.append('password', formData?.password);

    const profileForm = new FormData();
    profileForm.append('user_id', userState?.id);
    formData?.location && profileForm.append('location', formData?.location);
    formData?.description && profileForm.append('description', formData?.description);
    profileInputRef.current.files[0] && profileForm.append('profile_image', profileInputRef.current.files[0]);
    bannerInputRef.current.files[0] && profileForm.append('banner_image', bannerInputRef.current.files[0]);

    api
      .updateUser(userState?.id, userForm)
      .then(res => {
        if (res?.status === 200 && res?.data) {
          let lsUser = JSON.parse(localStorage.getItem('user'));
          lsUser.first_name = res?.data?.first_name;
          lsUser.email = res?.data?.email;
          localStorage.setItem('user', JSON.stringify(lsUser));
          setUserState(lsUser);
          navigate('/profile');
        }
      })

    api
      .updateProfile(profileForm)
      .then(res => {
        console.log(res);
      })
    
    notification.success('Profile updated successfully');
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
              <div className="col-xl-12">
                <div className="card">
                  <form action="#" id="updateProfileForm" onSubmit={updateProfile}>
                  <div className="card-body">
                    <div className="bacic-info mb-3">
                      <h4 className="mb-3">Basic info</h4>
                      <div className="row">
                        <div className="col-xl-6">
                          <label className="form-label">Name</label>
                          <input type="text" name="first_name" className="form-control mb-3" placeholder="Shop Name" defaultValue={userState?.first_name} required />
                        </div>
                        <div className="col-xl-6">
                          <label className="form-label">Email</label>
                          <input type="email" name="email" className="form-control mb-3" placeholder="Shop Email" defaultValue={userState?.email} required />
                        </div>
                        <div className="col-xl-6">
                          <label className="form-label">Username</label>
                          <input type="text" name="username" className="form-control mb-3" placeholder="Shop Username" defaultValue={userState?.username} readOnly required />
                        </div>
                        <div className="col-xl-6">
                          <label className="form-label">Phone</label>
                          <input type="text" name="phone" className="form-control mb-3" placeholder="Shop Phone" defaultValue={userState?.phone} required />
                        </div>
                      </div>
                    </div>
                    <div className="exernal-links mb-3">
                      <h4 className="mb-3">Other Info</h4>
                      <div className="row">
                        <div className="col-xl-12">
                          <label className="form-label">Location</label>
                          <input type="text" name="location" className="form-control mb-3" placeholder="Shop Location" defaultValue={profile?.location} required />
                        </div>
                        <div className="col-xl-12">
                          <label className="form-label">Description</label>
                          <textarea name="description" className="form-control mb-3 h-auto" cols="30" rows="4" defaultValue={profile?.description} required></textarea>
                        </div>
                        <div className="col-xl-12">
                          <label className="form-label">Profile Image</label>
                          <input type="file" name="profileImage" className="form-control mb-3" placeholder="Shop Profile Image" ref={profileInputRef} />
                        </div>
                        <div className="col-xl-12">
                          <label className="form-label">Banner Image</label>
                          <input type="file" name="bannerImage" className="form-control mb-3" placeholder="Shop Banner Image" ref={bannerInputRef} />
                        </div>
                      </div>
                    </div>
                    <div className="Security">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h4>Security</h4>
                        {/* <span className="badge badge-sm badge-primary c-pointer" id="ed-profile">Edit</span> */}
                      </div>
                      <div className="row">
                        <div className="col-xl-12">
                          <label className="form-label">Passward</label>
                          <input type="password" name="password" className="form-control mb-3" placeholder="Shop Password" required />
                          
                          <button type="button" className="btn btn-outline-primary float-end ms-3" onClick={() => navigate('/profile')}>Cancel</button>
                          <button type="submit" className="btn btn-primary float-end">Save</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </form>
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
 
export default UpdateProfile;