import Home from "./pages/home/Home";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Penghuni from "./pages/users/Penghuni";
import Rumah from "./pages/rumah/Rumah";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";
import "./styles/global.scss";
import User from "./pages/user/User";
import Product from "./pages/product/Product";

import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import KelolaPenghuni from "./pages/kelolaPenghuni/kelolaPenghuni";
import IuranBulanan from "./pages/iuranBulanan/IuranBulanan";
import MasterDataMonthly from "./pages/masterDataMonthly/MasterDataMonthly";
import MasterDataAccidential from "./pages/masterDataAccidential/MasterDataAccidential";
import IuranAccidential from "./pages/iuranAccidential/IuranAccidential";
function App() {


  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
              <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/login",
      element: 
      <Login />
      ,
    },
    {
      path: "/",
      element:       
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/penghuni",
          element: <Penghuni />,
        },
        {
          path: "/rumah",
          element: <Rumah />,
        },
        {
          path: "/kelola-penghuni",
          element: <KelolaPenghuni />,
        },
        {
          path: "/penghuni/:id",
          element: <User />,
        },
        {
          path: "/rumah/:id",
          element: <Product />,
        },
        {
          path: "/iuran-bulanan",
          element: <IuranBulanan />,
        },
        {
          path: "/master-data-monthly",
          element: <MasterDataMonthly />,
        },
        {
          path: "/master-data-accidential",
          element: <MasterDataAccidential />,
        },
        {
          path: "/iuran-bulanan",
          element: <IuranBulanan />,
        },
        {
          path: "/iuran-dadakan",
          element: <IuranAccidential />,
        },
        // {
        //   path: "/rumah/:id",
        //   element: <Product />,
        // },
        // {
        //   path: "/rumah/:id",
        //   element: <Product />,
        // },
      ],
    },

  ]);

  return <RouterProvider router={router} />;
}

export default App;
