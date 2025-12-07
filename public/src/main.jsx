import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import MainArchive from './user/mainArchive.jsx';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';

const rootElement = document.getElementById('root');

const router = createBrowserRouter([
  {path:"/",element:<App/>},
  {path:"/user",element: <MainArchive/>}
]);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
