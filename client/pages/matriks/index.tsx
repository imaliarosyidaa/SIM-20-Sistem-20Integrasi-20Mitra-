import React, { useState, useEffect, useCallback } from 'react';
import {
  RotateCcw,
} from 'lucide-react';
import { MatriksKegiatan } from '@/interfaces/types';
import useKegiatanApi from '@/lib/kegiatanApi';
import { months } from '../../constants'
import filterApi from '@/lib/filterApi';

export default function MatriksKegiatanOverview() {
  const [rekapKegiatanData, setRekapKegiatanData] = useState<MatriksKegiatan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentYear = new Date().getFullYear();
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
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
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return now.getMonth();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            id="tahun"
            value={selectedYear}
            onChange={(e) => {
              const year = Number(e.target.value);
              setSelectedYear(year);
              getRekapHonorPerBulan(year);
            }}
            className="border rounded px-3 py-2"
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
          className="flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset Filter
        </button>
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map((month, index) => {
          const isCurrentMonth = index === getCurrentMonth();
          const monthData = rekapKegiatanData?.find(item => item.bulan === month);
          const activitiesList = monthData ? monthData.kegiatan : [];

          return (
            <div
              key={month}
              className={`
                relative bg-white p-4 rounded-lg shadow overflow-hidden
                ${isCurrentMonth ? 'ring-2 ring-brand-500' : ''}
              `}
            >
              <div className='absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-purple-100 to-transparent rounded-b-lg'></div>
              <div className='p-4 flex justify-between items-center w-full'>
                <h2 className="text-xl font-bold">{month}</h2>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="px-4 relative flex items-center justify-between">
                <div className="space-y-2 mb-4 w-full h-32 overflow-y-auto">
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                    {activitiesList.map((kegiatan, kIndex) => (
                      <li key={kIndex}>{kegiatan}</li>
                    ))}
                  </ul>
                  {activitiesList?.length === 0 && (
                    <p className="text-gray-500 text-sm">Tidak ada kegiatan.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}