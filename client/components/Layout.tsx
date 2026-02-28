import React, { useState } from "react";
import logo from '../assets/logo-malowopati.png'
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Database,
  FileSpreadsheet,
  Home,
  Menu,
  Star,
  Users,
  X,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronDown,
  HandCoinsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import useLogout from "@/hooks/use-logout";
import { Box, LinearProgress } from "@mui/material";

interface LayoutProps {
  submenu?: React.ReactNode;
}

const menuItems = [
  {
    icon: Home,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: BarChart3,
    label: "Matriks Kegiatan",
    href: "/matriks",
  },
  {
    icon: FileSpreadsheet,
    label: "Rekap Honor Mitra",
    href: "/rekap-honor",
  },
  {
    icon: TrendingUp,
    label: "Tim Kegiatan",
    href: "/honor-bulanan",
    children: [
      {
        label: "Kegiatan Mitra",
        href: "/honor-bulanan",
      },
      {
        label: "Download Data",
        href: "/download-data",
      },
      {
        label: "Upload Template Kegiatan",
        href: "/upload-template",
      },
      {
        label: "Tambah Kegiatan",
        href: "/add-kegiatan",
      },
    ],
  },
  {
    icon: HandCoinsIcon,
    label: "Keuangan",
    href: "/keuangan",
  },
  {
    icon: Database,
    label: "Database Mitra",
    href: "/database",
  },
  {
    icon: Star,
    label: "Evaluasi Mitra",
    href: "/evaluasi",
  },
];
const findPath = (items, pathname, parents = []) => {
  for (let item of items) {
    if (item.href === pathname) {
      return [...parents, item];
    }
    if (item.children) {
      const childPath = findPath(item.children, pathname, [...parents, item]);
      if (childPath?.length) return childPath;
    }
  }
  return [];
};

export default function Layout({ submenu }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const location = useLocation();

  const mainMargin = "lg:pl-64";
  const currentPath = findPath(menuItems, location.pathname);
  const navigate = useNavigate();
  const logout = useLogout();
  const [isLoading, setIsLoading] = useState(false)

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [href]: !prev[href]
    }));
  };

  async function handleLogout() {
    await logout();
    navigate("/");
  };

  async function handleMovePage(href: string) {
    setSidebarOpen(false);
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      navigate(href);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {isLoading && (
        <Box sx={{ width: '100%', position: 'absolute', zIndex: '30' }}>
          {/* Menggunakan variant="indeterminate" */}
          <LinearProgress variant="indeterminate" />
        </Box>
      )}
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      )}

      {/* Sidebar - Kafka UI Style Exact */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform bg-white border-r border-gray-200 transition-all duration-300 lg:translate-x-0 w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex h-14 items-center px-6 border-b border-gray-200">
            <img
              alt="Malowopati"
              src={logo}
              className="h-10 w-auto"
            />
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-0 py-3">
            {/* Dashboard Section Header */}
            <div className="px-4 mb-3">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Dashboard
              </h3>
            </div>

            {/* Menu Items */}
            <div className="space-y-0">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedItems[item.href];
                const hasActiveChild = item.children?.some(child => location.pathname === child.href);

                return (
                  <div key={item.href}>
                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Main Menu Item */}
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          toggleExpanded(item.href);
                        } else {
                          handleMovePage(item.href);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 text-sm transition-colors",
                        isActive || hasActiveChild
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                      </div>

                      {hasChildren && (
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 flex-shrink-0 transition-transform text-gray-400",
                            isExpanded ? "rotate-180" : ""
                          )}
                        />
                      )}

                      {!hasChildren && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      )}
                    </button>

                    {/* Submenu */}
                    {hasChildren && isExpanded && (
                      <div className="bg-gray-50 border-t border-b border-gray-200">
                        {item.children?.map((child) => (
                          <button
                            key={child.href}
                            onClick={() => handleMovePage(child.href)}
                            className={cn(
                              "w-full flex items-center pl-14 py-2.5 text-sm transition-colors",
                              location.pathname === child.href
                                ? "bg-gray-100 text-blue-700 font-medium"
                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            )}
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Logout Footer */}
          <div className="border-t border-gray-200 px-4 py-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 px-2 py-1.5 rounded transition-colors"
            >
              <LogOut className="h-3.5 w-3.5 mr-2" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn("transition-all duration-300", mainMargin)}>
        {/* Top header */}
        <header className="sticky top-0 z-10 bg-white">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                {/* Breadcrumb */}
                <Breadcrumb>
                  <BreadcrumbList>
                    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" > <path d="M20.0402 6.82165L14.2802 2.79165C12.7102 1.69165 10.3002 1.75165 8.79023 2.92165L3.78023 6.83165C2.78023 7.61165 1.99023 9.21165 1.99023 10.4716V17.3716C1.99023 19.9216 4.06023 22.0016 6.61023 22.0016H17.3902C19.9402 22.0016 22.0102 19.9316 22.0102 17.3816V10.6016C22.0102 9.25165 21.1402 7.59165 20.0402 6.82165ZM12.7502 18.0016C12.7502 18.4116 12.4102 18.7516 12.0002 18.7516C11.5902 18.7516 11.2502 18.4116 11.2502 18.0016V15.0016C11.2502 14.5916 11.5902 14.2516 12.0002 14.2516C12.4102 14.2516 12.7502 14.5916 12.7502 15.0016V18.0016Z" fill="currentColor" /> </svg>

                    {currentPath.map((item, index) => (
                      <React.Fragment key={item.href}>
                        <BreadcrumbItem>
                          {index === currentPath?.length - 1 ? (
                            <BreadcrumbPage className="text-sm font-medium">
                              {item.label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={item.href} className="text-sm">
                              {item.label}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>

                        {/* Tambah separator jika bukan item terakhir */}
                        {index < currentPath?.length - 1 && <BreadcrumbSeparator />}
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>

            <div className="nav-item nav-profile dropdown">
              <div className="nav-profile-text">
                <Link className="dropdown-item cursor-pointer" onClick={() => handleLogout()} to={""}>
                  <i className="mdi mdi-logout me-2 text-primary"></i> Keluar </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="">
          <div className="mx-auto"><Outlet /></div>
        </main>
      </div>
    </div>
  );
}
