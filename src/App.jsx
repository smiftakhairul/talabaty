import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isLoggedInStateAtom, userStateAtom } from './utils/states/common';
import Menu from './views/app/menu';
import Login from './views/auth/login';
import Register from './views/auth/register';
import Profile from './views/app/profile';
import UpdateProfile from './views/app/profile/update';

function App() {
  const setIsLoggedInState = useSetRecoilState(isLoggedInStateAtom);
  const setUserState = useSetRecoilState(userStateAtom);

  useEffect(() => {
    if (localStorage.getItem('token') && localStorage.getItem('user')) {
      setIsLoggedInState(true);
      setUserState(JSON.parse(localStorage.getItem('user')));
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
          <Route path="/menus" element={<Menu />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </>
  )
}

export default App
