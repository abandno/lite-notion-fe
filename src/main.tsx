import React from 'react'
import ReactDOM from 'react-dom/client'
import "./index.css";
import Home from "@/pages/Home";
// import { BrowserRouter as Router } from 'react-router-dom';
import {isTrue} from "@/utils";
import './index.css'
import Router from '@/routes';

if (isTrue(process.env.REACT_APP_MOCK_API)) {
  console.log("=> REACT_APP_MOCK_API is " + process.env.REACT_APP_MOCK_API)
  require('@/api/mock');
}
// import "./api/mock"

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    // <Router>
    //   <Home/>
  // </Router>
  <Router />
  // </React.StrictMode>
)
