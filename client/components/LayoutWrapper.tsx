import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const location = useLocation();

  // Define submenus for specific routes
  const getSubmenu = () => {
    if (location.pathname === "/rekap-honor") {
      // This will be set by the RekapHonor component itself
      return null;
    }
    return null;
  };

  return <Layout submenu={getSubmenu()}>{children}</Layout>;
}
