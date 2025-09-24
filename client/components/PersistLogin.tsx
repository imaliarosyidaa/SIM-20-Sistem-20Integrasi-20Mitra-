import { useEffect, useState } from "react";
import useAuth from "../hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";
import useRefreshToken from "@/hooks/use-refresh-token";

const PersistLogin = () => {
  const { auth } = useAuth();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loading, setLoading] = useState(true);
  const refersh = useRefreshToken()

  useEffect(() => {
    async function verifyRefreshToken() { // Tes apakah refresh token perlu digunakan
      try {
        await refersh()
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    !auth?.accessToken ? verifyRefreshToken() : setLoading(false)
  }, []);

  // useEffect(() => {
  // Tanpa refresh token
  // if (auth?.accessToken) {
  //   setIsLoggedin(true);
  // } else {
  //   setIsLoggedin(false);
  // }
  // setLoading(false);
  // }, [auth]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // return isLoggedin ? <Outlet /> : <Navigate to="/" replace />;

  return (
    <>
    {
      loading ? "" : <Outlet />
    }
    </>
  )
};

export default PersistLogin;
