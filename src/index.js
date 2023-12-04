import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import 'antd/dist/antd.min.css';
import './index.css';
import './styles/antdTable.css';
import axios from 'axios';
import { serverUrl } from './services/Requests';
import { getUserId, getUserToken } from './utils/LocalData';

axios.defaults.baseURL = serverUrl();

const token = getUserToken();

if (!!token) {
  axios.defaults.headers.common.authorization = `${token}`
  axios.defaults.headers.common.idtoauth = getUserId() || 0;
}

//eslint-disable-next-line
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import { BrowserRouter } from "react-router-dom";
// import 'antd/dist/antd.css';
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );
