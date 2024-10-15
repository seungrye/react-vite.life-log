import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();

  return <>
    <Navbar pathname={location.pathname} />
    <Outlet />
    <Footer />
  </>
}

