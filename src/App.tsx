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
import { useEffect, useState } from 'react';
import Feedback404 from './components/Feedback404';
import Loading from './pages/Loading';
import { migrateFirestore } from './migrate/Migrate';

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
        path: "detail/:id",
        element: <PostDetail />
      },
      {
        path: "edit/:id?",
        element: <PostEditor />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "search/:query",
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
  const [loading, setLoading] = useState<boolean>(true);

  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  }

  useEffect(() => {
    migrateFirestore();
    init();
  }, []);

  return <>
    {loading ?
      <Loading />
      :
      <RouterProvider router={router} />
    }
  </>
}

