import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import PostEditor from './pages/PostEditor';
import PostDetail from './pages/PostDetail';
import Archived from './pages/Archived';
import Category from './pages/Category';
import SearchResult from './pages/SearchResult';
import Tag from './pages/Tag';
import About from './pages/Status';
import Status from './pages/Status';

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
        path: "about/:user",
        element: <About />
      },
      {
        path: "archived",
        element: <Archived />
      },
      {
        path: "category",
        element: <Category />
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
      }
    ]
  },
  {
    path: "/signin",
    element: <Signin />
  },
  {
    path: "/signup",
    element: <Signup />
  }
])

export default function App() {
  return <RouterProvider router={router} />
}

