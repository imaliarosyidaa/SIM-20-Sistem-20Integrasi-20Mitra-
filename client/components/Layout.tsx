import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    icon: Home,
    label: "Dashboard",
    href: "/",
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
    label: "Honor Mitra Bulanan",
    href: "/honor-bulanan",
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

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-brand-600 to-brand-800 transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">SIM</h1>
                <p className="text-xs text-blue-100">Sistem Integrasi Mitra</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-blue-100 hover:bg-white/10 hover:text-white",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6">
            <div className="rounded-lg bg-white/10 p-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    BPS Statistics
                  </p>
                  <p className="text-xs text-blue-100">
                    Kabupaten Lombok Tengah
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-10 bg-white shadow-sm border-b">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Sistem Informasi Manajemen Statistik
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Administrator
                </p>
                <p className="text-xs text-gray-500">BPS Lombok Tengah</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
