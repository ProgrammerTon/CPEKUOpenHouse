import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import MainArchive from './user/MainArchive.jsx';
import AddCourse from './admin/AddCourse.jsx';
import BoxComponent from './admin/BoxComponent.jsx';
import EditCourse from './admin/EditCourse.jsx';
import EditSpecificCourse from './admin/EditSpecificCourse.jsx';
import CourseContent from './user/CourseContent.jsx';
import AdminLogin from './admin/AdminLogin.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LogicGame from './user/LogicGame.jsx';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';

const rootElement = document.getElementById('root');

const router = createBrowserRouter([
  {path:"/",element:<App/>},
  {path:"/login",element:<AdminLogin/>},
  {path:"/user",element: <MainArchive/>},
  {path:"/logicgame",element: <LogicGame/>},
  {
    path: "/admin",
    element: <ProtectedRoute><AddCourse /></ProtectedRoute>
  },
  {
    path: "/edit-course",
    element: <ProtectedRoute><EditCourse /></ProtectedRoute>
  },
  {
    path: "/edit-specific-course/:id",
    element: <ProtectedRoute><EditSpecificCourse /></ProtectedRoute>
  },
  {path:"/course-content/:id",element: <CourseContent />}
]);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
