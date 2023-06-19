import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { RecoilRoot } from 'recoil'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <RecoilRoot>
      <App />
      <ToastContainer />
    </RecoilRoot>
  </React.Fragment>,
)
