import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import useApi from "../../hooks/useApi";
import useNotification from "../../hooks/useNotification";
import { env } from "../../utils/constants/common";
import { prepareFormFields } from "../../utils/helpers/common";
import { isLoggedInStateAtom, userStateAtom } from "../../utils/states/common";
import CheckAuth from "../../utils/middleware/check-auth";

const Login = () => {
  const api = useApi();
  const navigate = useNavigate();
  const notification = useNotification();
  const setIsLoggedInState = useSetRecoilState(isLoggedInStateAtom);
  const setUserState = useSetRecoilState(userStateAtom);

  const login = (e) => {
    e.preventDefault();
    const formData = prepareFormFields('loginForm');
    formData.role = env.VITE_ROLE;
    api
      .login(formData)
      .then(res => {
        if (res?.status === 200 && res?.data) {
          res?.data?.token && localStorage.setItem('token', res?.data?.token);
          res?.data?.user && localStorage.setItem('user', JSON.stringify(res?.data?.user));
          setIsLoggedInState(true);
          setUserState(res?.data?.user);
          navigate('/menus');
        }
      })
      .catch(err => {
        console.log(err);
        notification.error('Invalid Credentials.');
      })
  }

  return (
    <>
    <CheckAuth />
    <div className="body">
      <div className="container mt-0">
        <div className="row align-items-center justify-contain-center">
          <div className="col-xl-12 mt-5">
            <div className="card border-0">
              <div className="card-body login-bx">
                <div className="row  mt-5">
                  <div className="col-xl-8 col-md-6 sign text-center">
                    <div>
                      <img src="images/login-img/pic-5.jpg" className="food-img" alt="" />
                    </div>	
                  </div>
                  <div className="col-xl-4 col-md-6 pe-0">
                    <div className="sign-in-your mt-5">
                      <div className="text-center mb-3">
                        <img src="images/talabaty.png" height="45" className="mb-3" alt="" /> <span className="text-warning"><b>Shop</b></span>
                        <h4 className="fs-20 font-w800 text-black">Sign in as Shop</h4>
                        <span className="dlab-sign-up">Sign In</span>
                      </div>
                      <form id="loginForm" action="#" onSubmit={login}>
                        <div className="mb-3">
                          <label className="mb-1"><strong>Username</strong></label>
                          <input type="text" name="username" className="form-control" required placeholder="Enter shop username" />
                        </div>
                        <div className="mb-3">
                          <label className="mb-1"><strong>Password</strong></label>
                          <input type="password" name="password" className="form-control" required placeholder="Enter shop password" />
                        </div>
                        <div className="row d-flex justify-content-between mt-4 mb-2">
                          <div className="mb-3">
                            <div className="form-check custom-checkbox ms-1">
                              <input type="checkbox" className="form-check-input" id="basic_checkbox_1" />
                              <label className="form-check-label" htmlFor="basic_checkbox_1">Remember me</label>
                            </div>
                          </div>
                          {/* <div className="mb-3">
                            <a href="page-forgot-password.html">Forgot Password?</a>
                          </div> */}
                        </div>
                        <div className="text-center">
                          <button type="submit" className="btn btn-primary btn-block shadow">Sign Me In</button>
                        </div>
                      </form>
                      <div className="text-center mt-3">
                        <span>Shop is not registered yet?<Link to="/register" className="text-primary"> Create New</Link></span>
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
    </>
  );
}
 
export default Login;