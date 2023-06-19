import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { isLoggedInStateAtom, userStateAtom } from "../states/common";
import { useLocation, useNavigate } from "react-router-dom";

const CheckAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedInState = useRecoilValue(isLoggedInStateAtom);
  const userState = useRecoilValue(userStateAtom);

  useEffect(() => {
    // console.log(isLoggedInState);
    // if (isLoggedInState) {
    //   if (location.pathname === '/login' || location.pathname === '/register') {
    //     navigate('/menus');
    //   }
    // } else {
    //   console.log('here');
    //   if (location.pathname !== '/register') {
    //     navigate('/login');
    //   }
    // }
  }, [isLoggedInState])

  return null;
}
 
export default CheckAuth;