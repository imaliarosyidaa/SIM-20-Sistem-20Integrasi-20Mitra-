import React, { useState } from "react";
import { months } from '../constants'

import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Clock,
  Users,
  MapPin,
} from "lucide-react";

// Mock data for activities
const activities = [
  {
    id: 1,
    title: "Sensus Penduduk",
    category: "Data Mining",
    date: "2025-07-01",
    time: "09:00",
    duration: "4 jam",
    participants: ["ACHMAD SYAHRUL CHOIR"],
    location: "Desa Praya",
    color: "bg-blue-500",
    status: "confirmed",
  },
  {
    id: 2,
    title: "Survei Ekonomi",
    category: "Interaksi Manusia dan Komputer",
    date: "2025-07-08",
    time: "08:00",
    duration: "6 jam",
    participants: ["Tim Survei A"],
    location: "Kecamatan Praya",
    color: "bg-green-500",
    status: "pending",
  },
  {
    id: 3,
    title: "Pendataan Harga",
    category: "K203504",
    date: "2025-07-15",
    time: "10:00",
    duration: "3 jam",
    participants: ["Tim Harga"],
    location: "Pasar Praya",
    color: "bg-purple-500",
    status: "confirmed",
  },
];

const dayNames = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];
const dayNamesShort = ["Sn", "Sl", "Rb", "Km", "Jm", "Sb", "Mg"];

export default function MatriksKegiatan() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); // July 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [showSidebar, setShowSidebar] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get days in current month
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek =
    firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;

  // Generate calendar days
  const calendarDays = [];

  // Previous month's trailing days
  const prevMonth = new Date(year, month - 1, 0);
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonth.getDate() - i,
      isCurrentMonth: false,
      isPreviousMonth: true,
      date: new Date(year, month - 1, prevMonth.getDate() - i),
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isPreviousMonth: false,
      date: new Date(year, month, day),
    });
  }

  // Next month's leading days
  const totalCells = Math.ceil(calendarDays?.length / 7) * 7;
  const remainingCells = totalCells - calendarDays?.length;
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isPreviousMonth: false,
      date: new Date(year, month + 1, day),
    });
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getActivitiesForDate = (date: Date) => {
    return activities?.filter((activity) => {
      const activityDate = new Date(activity.date);
      return activityDate.toDateString() === date.toDateString();
    });
  };

  const today = new Date();
  const isToday = (date: Date) => date.toDateString() === today.toDateString();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <button className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors mb-4">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kegiatan
            </button>

            {/* Mini Calendar */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => navigateMonth("prev")}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium">
                  {months[month]} {year}
                </span>
                <button
                  onClick={() => navigateMonth("next")}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNamesShort.map((day) => (
                  <div
                    key={day}
                    className="text-xs text-gray-500 text-center p-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays?.slice(0, 42).map((dayData, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(dayData.date)}
                    className={`
                      text-xs p-1 rounded hover:bg-blue-100 transition-colors
                      ${!dayData.isCurrentMonth ? "text-gray-300" : "text-gray-900"}
                      ${isToday(dayData.date) ? "bg-brand-600 text-white hover:bg-brand-700" : ""}
                      ${selectedDate?.toDateString() === dayData.date.toDateString() ? "bg-blue-100" : ""}
                    `}
                  >
                    {dayData.day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Categories */}
          <div className="flex-1 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Kategori Kegiatan
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm">Data Mining</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-sm">Survei Lapangan</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                <span className="text-sm">Interaksi Manusia dan Komputer</span>
              </div>
            </div>

            {/* Upcoming Activities */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Kegiatan Mendatang
              </h3>
              <div className="space-y-3">
                {activities?.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </h4>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time} ({activity.duration})
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {activity.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Calendar */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Calendar className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold">
                {months[month]} {year}
              </h1>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <button className="px-3 py-1 text-sm text-brand-600 border border-brand-600 rounded hover:bg-brand-50">
              Hari Ini
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("month")}
                className={`px-3 py-1 text-sm rounded ${viewMode === "month" ? "bg-white shadow" : ""}`}
              >
                Bulan
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-3 py-1 text-sm rounded ${viewMode === "week" ? "bg-white shadow" : ""}`}
              >
                Minggu
              </button>
              <button
                onClick={() => setViewMode("day")}
                className={`px-3 py-1 text-sm rounded ${viewMode === "day" ? "bg-white shadow" : ""}`}
              >
                Hari
              </button>
            </div>

            <button className="p-2 hover:bg-gray-100 rounded">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b">
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 flex-1">
            {calendarDays.map((dayData, index) => {
              const dayActivities = getActivitiesForDate(dayData.date);

              return (
                <div
                  key={index}
                  className={`
                    min-h-[120px] border-r border-b p-2 hover:bg-gray-50 cursor-pointer
                    ${!dayData.isCurrentMonth ? "bg-gray-50/50" : "bg-white"}
                  `}
                  onClick={() => setSelectedDate(dayData.date)}
                >
                  <div
                    className={`
                    flex items-center justify-center w-6 h-6 rounded-full text-sm mb-2
                    ${!dayData.isCurrentMonth ? "text-gray-300" : "text-gray-900"}
                    ${isToday(dayData.date) ? "bg-brand-600 text-white" : ""}
                    ${selectedDate?.toDateString() === dayData.date.toDateString() ? "bg-blue-100" : ""}
                  `}
                  >
                    {dayData.day}
                  </div>

                  {/* Activities */}
                  <div className="space-y-1">
                    {dayActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className={`
                          text-xs p-1 rounded text-white truncate cursor-pointer
                          ${activity.color}
                        `}
                        title={`${activity.title} - ${activity.time}`}
                      >
                        {activity.title}
                      </div>
                    ))}
                    {dayActivities?.length > 2 && (
                      <div className="text-xs text-gray-500 pl-1">
                        +{dayActivities?.length - 2} lainnya
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
