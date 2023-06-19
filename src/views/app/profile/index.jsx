import loadjs from "loadjs";
import { useEffect, useState } from "react";
import CheckAuth from "../../../utils/middleware/check-auth";
import PreLoader from "../partials/pre-loader";
import NavHeader from "../partials/nav-header";
import Header from "../partials/header";
import Navbar from "../partials/navbar";
import { useRecoilValue } from "recoil";
import { userStateAtom } from "../../../utils/states/common";
import useApi from "../../../hooks/useApi";
import { ucFirst } from "../../../utils/helpers/common";
import { Link } from "react-router-dom";

const Profile = () => {
  const api = useApi();
  const userState = useRecoilValue(userStateAtom);
  const [profile, setProfile] = useState(null);

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
              <div className="col-lg-12">
                <div className="profile card card-body px-3 pt-3 pb-0">
                  <div className="profile-head">
                    <div className="photo-content">
                      <div
                        className="cover-photo rounded"
                        style={{
                          background: "url("+ (profile?.banner_image || "../images/profile/cover.jpg") +")",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          minHeight: "15.625rem",
                          width: "100%",
                        }}
                      ></div>
                    </div>
                    <div className="profile-info">
                      <div className="profile-photo">
                        <img src={profile?.profile_image} className="img-fluid rounded-circle" alt="" />
                      </div>
                      <div className="profile-details">
                        <div className="profile-name px-3 pt-2">
                          <h4 className="text-primary mb-0">{userState?.first_name}</h4>
                          <p>{ucFirst(userState?.role)}</p>
                        </div>
                        <div className="profile-email px-3 pt-2">
                          <h4 className="text-muted mb-0">{userState?.email}</h4>
                          <p>Email</p>
                        </div>
                        <div className="profile-email px-3 pt-2">
                          <h4 className="text-muted mb-0">{profile?.location}</h4>
                          <p>Location</p>
                        </div>
                        <div className="profile-email px-3 pt-2">
                          <h4 className="text-muted mb-0">{userState?.phone}</h4>
                          <p>Phone</p>
                        </div>
                        <div className="dropdown ms-auto">
                          <a href="#" className="btn btn-primary light sharp" data-bs-toggle="dropdown" aria-expanded="true">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="0 0 24 24" version="1.1">
                              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <rect x="0" y="0" width="24" height="24"></rect>
                                <circle fill="#000000" cx="5" cy="12" r="2"></circle>
                                <circle fill="#000000" cx="12" cy="12" r="2"></circle>
                                <circle fill="#000000" cx="19" cy="12" r="2"></circle>
                              </g>
                            </svg>
                          </a>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li className="dropdown-item">
                              <Link to="/update-profile"><i className="fa fa-user-circle text-primary me-2"></i> Update Profile</Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="card card-body">
                  {profile?.description}
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
 
export default Profile;