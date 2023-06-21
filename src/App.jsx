import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { cartStateAtom, isLoggedInStateAtom, userStateAtom } from './utils/states/common';
import AllOrder from './views/app/all-orders';
import Dashboard from './views/app/dashboard';
import Order from './views/app/order';
import Profile from './views/app/profile';
import UpdateProfile from './views/app/profile/update';
import Shop from './views/app/shop';
import Login from './views/auth/login';
import Register from './views/auth/register';

function App() {
  const setIsLoggedInState = useSetRecoilState(isLoggedInStateAtom);
  const setUserState = useSetRecoilState(userStateAtom);
  const setCartState = useSetRecoilState(cartStateAtom);

  useEffect(() => {
    if (localStorage.getItem('token') && localStorage.getItem('user')) {
      setIsLoggedInState(true);
      setUserState(JSON.parse(localStorage.getItem('user')));
    }
    if (localStorage.getItem('cart')) {
      const cart = JSON.parse(localStorage.getItem('cart'));
      setCartState(cart);
    }
  }, [])

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shop/:id" element={<Shop />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/all-orders" element={<AllOrder />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
