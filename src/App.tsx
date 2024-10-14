import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import PostEditor from './pages/PostEditor';
import PostDetail from './pages/PostDetail';

const router = createBrowserRouter([
  {
    path:"/",
    element: <Layout/>,
    children: [
      {
        path: "",
        element: <Home/>
      },
      {
        path: "profile",
        element: <Profile />
      },
      { path: "edit",
        element: <PostEditor/>
      },
      { path: "detail",
        element: <PostDetail/>
      }
    ]
  },
  {
    path: "/signin",
    element: <Signin/>
  },
  {
    path: "/signup",
    element: <Signup/>
  }
])

export default function App() {
  return <RouterProvider router={router}/>
}

