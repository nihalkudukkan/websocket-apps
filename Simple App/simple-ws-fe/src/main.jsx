import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './Home.jsx';
import Author from './components/broadcast/Author.jsx';
import Subscriber from './components/broadcast/Subscriber.jsx';
import ChatHome from './components/Chat/ChatHome.jsx';
import ChatUser from './components/Chat/ChatUser.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/broadcast/author",
    element: <Author />,
  },
  {
    path: "/broadcast/subscriber",
    element: <Subscriber />,
  },
  {
    path: "/chathome",
    element: <ChatHome />
  },
  {
    path: "/chat/:username",
    element: <ChatUser />
  }
]);


createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
