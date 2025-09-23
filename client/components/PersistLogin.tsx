import { useEffect, useState } from "react";
import useAuth from "../hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";

const PersistLogin = () => {
  const { auth } = useAuth();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth?.accessToken) {
      setIsLoggedin(true);
    } else {
      setIsLoggedin(false);
    }
    setLoading(false);
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>; // sementara tampilin loading
  }

  return isLoggedin ? <Outlet /> : <Navigate to="/" replace />;
};

export default PersistLogin;
