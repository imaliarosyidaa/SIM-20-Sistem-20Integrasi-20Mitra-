import React, { useState, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { MatriksKegiatan } from '@/interfaces/types';
import useKegiatanApi from '@/lib/kegiatanApi';
import { months } from '../../constants'
import filterApi from '@/lib/filterApi';
import { cn } from '@/lib/utils';

export default function MatriksKegiatanOverview() {
  const [rekapKegiatanData, setRekapKegiatanData] = useState<MatriksKegiatan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentYear = new Date().getFullYear();
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  const { getTahun } = filterApi();

  const { getMatriksKegiatan } = useKegiatanApi();

  const getRekapHonorPerBulan = useCallback(async (selectedYear) => {
    getMatriksKegiatan(selectedYear).then((matriks) => { setRekapKegiatanData(matriks) })
      .catch((err) => { setError(true) })
      .finally(() => { setIsLoading(false) })
  }, [])

  async function fetchTahun() {
    getTahun().then((res) => {
      setYears(res);
    })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    getRekapHonorPerBulan(selectedYear)
    fetchTahun()
  }, [selectedYear]);

  const resetFilters = () => {
    setSelectedYear(currentYear);
    setSelectedMonthIndex(new Date().getMonth());
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return now.getMonth();
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonthIndex);
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonthIndex);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const currentMonthData = rekapKegiatanData?.find(item => item.bulan === months[selectedMonthIndex]);
  const activitiesList = currentMonthData ? currentMonthData.kegiatan : [];

  return (
    <div className="space-y-4 p-4 bg-gray-50 min-h-screen">
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-white p-3 rounded border border-gray-300">
        <div className="flex flex-wrap items-center gap-2">
          <select
            id="tahun"
            value={selectedYear}
            onChange={(e) => {
              const year = Number(e.target.value);
              setSelectedYear(year);
              getRekapHonorPerBulan(year);
            }}
            className="border border-gray-400 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-500"
          >
            {years.map((year) => (
              <option key={year.year} value={year.year}>
                {year.year}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset Filter
        </button>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900">Matriks Kegiatan Tahun {selectedYear}</h2>

      {/* 12 Month Cards Grid - 3x4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {months.map((month, monthIndex) => {
          const monthData = rekapKegiatanData?.find(item => item.bulan === month);
          const activitiesList = monthData ? monthData.kegiatan : [];
          const daysInMonth = getDaysInMonth(selectedYear, monthIndex);
          const firstDay = getFirstDayOfMonth(selectedYear, monthIndex);
          const isCurrentMonth = monthIndex === getCurrentMonth() && selectedYear === currentYear;

          // Generate calendar days for this month
          const calendarDays = [];
          for (let i = 0; i < firstDay; i++) {
            calendarDays.push(null);
          }
          for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push(i);
          }

          return (
            <div
              key={month}
              className={cn(
                "bg-white rounded-lg border shadow-sm overflow-hidden transition-all hover:shadow-md",
                isCurrentMonth ? "border-blue-300 ring-2 ring-blue-300" : "border-gray-200"
              )}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-bold text-gray-900">{month}</h3>
              </div>

              {/* Mini Calendar */}
              <div className="p-3">
                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="text-center text-xs font-bold text-gray-400 py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {calendarDays.map((day, index) => {
                    const isCurrentDay = day === new Date().getDate() && monthIndex === getCurrentMonth() && selectedYear === currentYear;
                    return (
                      <div
                        key={index}
                        className={cn(
                          "h-6 flex items-center justify-center rounded text-xs font-medium transition-colors",
                          day === null
                            ? "bg-transparent"
                            : isCurrentDay
                              ? "bg-blue-500 text-white ring-1 ring-blue-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activities List */}
              <div className="px-4 py-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-900 mb-2">
                  Kegiatan ({activitiesList.length})
                </p>
                {activitiesList.length > 0 ? (
                  <ul className="space-y-1 max-h-24 overflow-y-auto">
                    {activitiesList.map((kegiatan, index) => (
                      <li key={index} className="text-xs text-gray-700 flex items-start gap-2">
                        <span className="text-blue-500 font-bold flex-shrink-0">•</span>
                        <span className="line-clamp-2">{kegiatan}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400">Tidak ada kegiatan</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}