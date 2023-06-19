import { Link, useNavigate } from "react-router-dom";
import { prepareFormFields } from "../../utils/helpers/common";
import CheckAuth from "../../utils/middleware/check-auth";
import { env } from "../../utils/constants/common";
import useNotification from "../../hooks/useNotification";
import useApi from "../../hooks/useApi";

const Register = () => {
  const api = useApi();
  const navigate = useNavigate();
  const notification = useNotification();

  const register = (e) => {
    e.preventDefault();
    const formData = prepareFormFields('registerForm');
    formData.role = env.VITE_ROLE;
    api
      .register(formData)
      .then(res => {
        if (res?.status === 201 && res?.data) {
          notification.success('Shop registered successfully.');
          navigate('/login');
        }
      })
      .catch(err => {
        console.log(err);
        notification.error('Something went wrong.');
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
                    <div className="sign-in-your">
                      <div className="text-center mb-3">
                        <img src="images/talabaty.png" height="45" className="mb-3" alt="" /> <span className="text-warning"><b>Shop</b></span>
                        <h4 className="fs-20 font-w800 text-black">Create new Shop</h4>
                        <span className="dlab-sign-up">Sign Up</span>
                      </div>
                      <form id="registerForm" action="#" onSubmit={register}>
                        <div className="mb-3">
                          <label className="mb-1"><strong>Name</strong></label>
                          <input type="text" name="first_name" className="form-control" required placeholder="Enter shop name" />
                        </div>
                        <div className="mb-3">
                          <label className="mb-1"><strong>Username</strong></label>
                          <input type="text" name="username" className="form-control" required placeholder="Enter shop username" />
                        </div>
                        <div className="mb-3">
                          <label className="mb-1"><strong>Email</strong></label>
                          <input type="email" name="email" className="form-control" required placeholder="Enter shop email" />
                        </div>
                        <div className="mb-3">
                          <label className="mb-1"><strong>Phone</strong></label>
                          <input type="text" name="phone" className="form-control" required placeholder="Enter shop phone" />
                        </div>
                        <div className="mb-3">
                          <label className="mb-1"><strong>Password</strong></label>
                          <input type="password" name="password" className="form-control" required placeholder="Enter shop password" />
                        </div>
                        <div className="text-center">
                          <button type="submit" className="btn btn-primary btn-block shadow">Sign Up</button>
                        </div>
                      </form>
                      <div className="text-center mt-3">
                        <span>Already registered?<Link to="/login" className="text-primary"> Sign In</Link></span>
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
 
export default Register;