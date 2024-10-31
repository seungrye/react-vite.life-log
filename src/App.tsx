import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import PostEditor from './pages/PostEditor';
import PostDetail from './pages/PostDetail';
import Archived from './pages/Archived';
import SearchResult from './pages/SearchResult';
import Tag from './pages/Tag';
import About from './pages/Status';
import Status from './pages/Status';
import { auth } from './firebase';
import { useEffect } from 'react';
import Feedback404 from './components/Feedback404';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "archived",
        element: <Archived />
      },
      {
        path: "detail",
        element: <PostDetail />
      },
      {
        path: "edit",
        element: <PostEditor />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "search",
        element: <SearchResult />
      },
      {
        path: "status",
        element: <Status />
      },
      {
        path: "tag",
        element: <Tag />
      },
      {
        path: "/signin",
        element: <Signin />
      },
      {
        path: "/signup",
        element: <Signup />
      },
      {
        path: "*",
        element: <Feedback404 />
      }
    ]
  },
])

export default function App() {

  const init = async () => {
    await auth.authStateReady();
  }

  useEffect(() => {
    init();
  }, []);


  return <RouterProvider router={router} />
}

