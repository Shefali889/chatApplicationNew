import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import ReduxProvider from './redux/provider';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Navbar from './components/Navbar';
import Login from './screens/Login';
import ForgotPassword from './screens/ForgotPassword';
import NewPassword from './screens/NewPassword';
import Signup from './screens/Signup';
import Chats from './screens/Chats';

const root = createRoot(document.getElementById("root"));
root.render(

  <ReduxProvider>
    <BrowserRouter basename="/">
      <div className='fullpage'>
        <Navbar />
        <Routes>
          <Route path="/" Component={App} />
          <Route path="/login" Component={Login} />
          <Route path="/forgotpassword" Component={ForgotPassword} />
          <Route path="/forgotpassword/newpassword" Component={NewPassword} />
          <Route path="/signup" Component={Signup} />
          <Route path="/chats" Component={Chats} />
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  </ReduxProvider>


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
