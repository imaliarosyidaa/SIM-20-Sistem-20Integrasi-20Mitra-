import React, { useCallback, useEffect, useState } from "react";
import batasHonorApi from "@/lib/honorApi";
import filesApi from "@/lib/filesApi";
import useAuth from "@/hooks/use-auth";
import useHonorApi from "@/lib/honorApi";
import useFilesApi from "@/lib/filesApi";
import { RotateCcw } from "lucide-react";
import { months } from '../../constants'
import useKegiatanMitraApi from "@/lib/kegaiatanMitraApi";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts";
import useKegiatanApi from "@/lib/kegiatanApi";
import circle_image from '../../assets/circle.svg'
import clsx from "clsx";
import filterApi from "@/lib/filterApi";

export default function Dashboard() {

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [idSobat, setIdSobat] = useState('');

  const currentYear = new Date().getFullYear();

  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState(Number(currentYear).toString());
  const { getTahun } = filterApi();

  const [selectedMonth, setSelectedMonth] = useState('');
  const [rekapHonorPerBulan, setRekapHonorPerBulan] = useState([]);
  const [rincianKegiatan, setRincianKegiatan] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [honorPerbulan, setHonorPerBulan] = useState([])
  const [kegiatanMitra, setKegiatanMitra] = useState([])
  const [kegiatanByTim, setKegiatanByTim] = useState([])
  const [totalKegiatan, setTotalKegiatan] = useState()
  const [activeRowId, setActiveRowId] = useState()

  const { getHonorTop10 } = useHonorApi();
  const { getRincianKegiatanMitra } = useKegiatanMitraApi();
  const { getRekapHonorPerBulan } = useHonorApi()
  const { getKegiatanByTim } = useKegiatanApi()

  const getHonorTop10Data = useCallback(async (year, month) => {
    try {
      const res = await getHonorTop10(year, month);
      setRekapHonorPerBulan(Array.isArray(res) ? res : res?.data || []);
    } catch (err) {
      console.error("gagal mengambil data", err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  console.log(rekapHonorPerBulan)

  const filteredItems = (rekapHonorPerBulan || []).filter(item =>
    (item?.namaLengkap || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetFilters = () => {
    setSelectedYear('');
    setSelectedMonth('')
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const getRincianHonorMitraData = useCallback(async (year, month, idSobat) => {
    try {
      const res = await getRincianKegiatanMitra(year, month, idSobat);
      setRincianKegiatan(res);
      const mitraById = res.mitra
      if (!idSobat) {
        setKegiatanMitra([])
      } else {
        setKegiatanMitra(mitraById[0].KegiatanMitra)
      }
    } catch (err) {
      console.error("gagal mengambil data", err);
    } finally {
      setIsLoading(false);
    }
  }, [idSobat]);

  const getRekapHonorPerBulanData = useCallback(async (selectedYear, month, sobatId) => {
    setIsLoading(true);

    getRekapHonorPerBulan(selectedYear).then((res) => {
      const found = res.find(item => item.bulan === selectedMonth);
      if (found) {
        setHonorPerBulan(found.total);
      }
    }).catch((err) => {
      console.error("gagal mengambil data", err);
    })
      .finally(() => { setIsLoading(false) })
  }, [selectedMonth]);

  const getKegiatanByTimData = useCallback(async (selectedYear, month, sobatId) => {
    setIsLoading(true);

    getKegiatanByTim(selectedYear, month, sobatId).then((res) => {
      setKegiatanByTim(res.grouped)
      setTotalKegiatan(res.total)
    }).catch((err) => {
      console.error("gagal mengambil data", err);
    })
      .finally(() => { setIsLoading(false) })
  }, [selectedMonth]);

  async function fetchTahun() {
    getTahun().then((res) => {
      setYears(res);
    })
      .catch()
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (selectedMonth && selectedMonth) {
      getRekapHonorPerBulanData(selectedYear, selectedMonth, idSobat)
    }
    fetchTahun()
    getHonorTop10Data(selectedYear, selectedMonth);
    getRincianHonorMitraData(selectedYear, selectedMonth, idSobat);
    getKegiatanByTimData(selectedYear, selectedMonth, idSobat);
  }, [selectedYear, selectedMonth, idSobat]);

  function handleClickRow(sobatId) {
    setIsLoading(false)
    setIdSobat(sobatId)
  }

  function toRupiah(nominal: any) {
    const num = Number(nominal);

    if (isNaN(num)) return "Rp0";

    if (num > 1_000_000) {
      if (num > 1_000_000_000) {
        return "Rp" + (num / 1_000_000_000).toFixed(1) + "Miliyar";
      } else {
        return "Rp" + (num / 1_000_000).toFixed(1) + "Jt";
      }
    } else {
      return num.toLocaleString("id-ID");
    }
  }

  return (
    <div className="space-y-3 p-4 bg-gray-50">
      {/* Card Modern Minimalis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-5 hover:shadow-lg transition-shadow hover:border-blue-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Jumlah Kegiatan</p>
                {/* BADGE TAHUN */}
                <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {selectedYear ? selectedYear : currentYear}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mt-2">{rincianKegiatan?.countKegiatanMitra}</h2>
            </div>
            <div className="text-blue-400 text-3xl opacity-30">
              <i className="mdi mdi-chart-line"></i>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 p-5 hover:shadow-lg transition-shadow hover:border-cyan-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-cyan-600 font-medium uppercase tracking-wide">Jumlah Mitra</p>
                {/* BADGE TAHUN */}
                <span className="bg-cyan-100 text-cyan-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {selectedYear ? selectedYear : currentYear}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-cyan-900 mt-2">{rincianKegiatan?.countMitra.toLocaleString("id-ID")}</h2>
            </div>
            <div className="text-cyan-400 text-3xl opacity-30">
              <i className="mdi mdi-bookmark-outline"></i>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 p-5 hover:shadow-lg transition-shadow hover:border-emerald-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Total Honor</p>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {selectedYear ? selectedYear : currentYear}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-emerald-900 mt-2">{selectedMonth ? toRupiah(honorPerbulan) : toRupiah(rincianKegiatan?.sumHonor)}</h2>
            </div>
            <div className="text-emerald-400 text-3xl opacity-30">
              <i className="mdi mdi-diamond"></i>
            </div>
          </div>
        </div>
      </div>
      {/* End Card Modern */}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-white p-3 rounded border border-gray-300">
        <div className="flex flex-wrap items-center gap-2">
          <select
            id="tahun"
            value={selectedYear}
            onChange={(e) => {
              const year = e.target.value;
              setSelectedYear(year);
              getRekapHonorPerBulanData(year, selectedMonth, idSobat);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={''}>
              Pilih Tahun
            </option>
            {years.map((year, index) => (
              <option key={index} value={year.year}>
                {year.year}
              </option>
            ))}
          </select>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => {
              const month = e.target.value;
              setSelectedMonth(month);
              getRekapHonorPerBulanData(selectedYear, month, idSobat);
            }}
            className="border border-gray-400 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-500"
          >
            <option>
              Pilih Bulan
            </option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
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

      <div className="row">
        <div className="col-md-7 grid-margin">
          <div className="">
            <div className="">
              <h4 className="mb-2 text-sm font-bold">10 Mitra dengan Honor Tertinggi</h4>
              <div className="relative overflow-x-auto bg-white rounded border border-gray-400">
                <table className="w-full text-xs text-left rtl:text-right">
                  <thead className="text-xs font-semibold text-white bg-blue-600 border-b-2 border-blue-700 uppercase">
                    <tr>
                      <th scope="col" className="px-3 py-2 border-r border-gray-400"> No. </th>
                      <th scope="col" className="px-3 py-2 border-r border-gray-400"> Nama Mitra </th>
                      <th scope="col" className="px-3 py-2 border-r border-gray-400"> Jumlah Kegiatan </th>
                      <th scope="col" className="px-3 py-2"> Honor </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <>
                        {[...Array(10)].map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td className="px-3 py-1 border-b border-r border-gray-300">
                              <div className="h-3 bg-gray-200 rounded w-6"></div>
                            </td>
                            <td className="px-3 py-1 border-b border-r border-gray-300">
                              <div className="h-3 bg-gray-200 rounded w-32"></div>
                            </td>
                            <td className="px-3 py-1 border-b border-r border-gray-300">
                              <div className="h-3 bg-gray-200 rounded w-16"></div>
                            </td>
                            <td className="px-3 py-1 border-b border-gray-300">
                              <div className="h-3 bg-gray-200 rounded w-16"></div>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : currentItems?.length > 0 ? (
                      currentItems.map((kegmitra, index) => (
                        <React.Fragment key={kegmitra.sobatId}>
                          <tr onClick={() => { handleClickRow(kegmitra.sobatId); setActiveRowId(kegmitra.sobatId) }}
                            className={clsx(
                              activeRowId === kegmitra.sobatId ? "bg-blue-100" : "bg-white hover:bg-gray-50",
                              "border-b border-gray-300 cursor-pointer transition-colors"
                            )}>
                            <td className="px-3 py-1 font-medium text-gray-900 whitespace-nowrap border-r border-gray-300">
                              {indexOfFirstItem + index + 1}.
                            </td>
                            <td scope="row" className="px-3 py-1 font-medium whitespace-nowrap capitalize border-r border-gray-300">
                              {kegmitra.namaLengkap}
                            </td>
                            <td className="px-3 py-1 font-medium text-gray-900 whitespace-nowrap text-center border-r border-gray-300">
                              {kegmitra.jumlahKegiatan}
                            </td>
                            <td className="px-3 py-1 font-mono text-gray-900 whitespace-nowrap">
                              {kegmitra.honor.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-3 py-2 text-xs text-gray-500 text-center border-t border-gray-300">
                          Tidak ada data kegiatan tahun {currentYear}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5 ">
          <h4 className="mb-2 text-sm font-bold">Rincian Honor Mitra Per Kegiatan</h4>
          <div className="mt-1 mb-4">
            <div className="overflow-x-auto bg-white rounded border border-gray-400 block max-h-[490px]">
              <table className="text-xs w-full text-left">
                <thead className="text-xs font-semibold text-white bg-blue-600 uppercase sticky top-0 border-b-2 border-blue-700">
                  <tr>
                    <th scope="col" className="px-3 py-1 border-r border-gray-400">No.</th>
                    <th scope="col" className="px-3 py-1 border-r border-gray-400">Tim</th>
                    <th scope="col" className="px-3 py-1 border-r border-gray-400">Kegiatan</th>
                    <th scope="col" className="px-3 py-1">Honor</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-auto">
                  {isLoading ? (
                    <>
                      {[...Array(10)].map((_, i) => (
                        <tr key={i} className="animate-pulse text-xs">
                          <td className="px-3 py-1 border-b border-r border-gray-300">
                            <div className="h-3 bg-gray-200 rounded w-4"></div>
                          </td>
                          <td className="px-3 py-1 border-b border-r border-gray-300">
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </td>
                          <td className="px-3 py-1 border-b border-r border-gray-300">
                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                          </td>
                          <td className="px-3 py-1 border-b border-gray-300">
                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : kegiatanMitra?.length > 0 ? (
                    kegiatanMitra?.map((kegmitra, index) => (
                      <tr key={index} className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-1 font-medium text-gray-900 border-r border-gray-300">{indexOfFirstItem + index + 1}.</td>
                        <td className="px-3 py-1 font-medium text-gray-900 border-r border-gray-300 text-xs">{kegmitra.tim}</td>
                        <td className="px-3 py-1 font-medium text-gray-900 border-r border-gray-300 text-xs">{kegmitra.nama_survei_sobat}</td>
                        <td className="px-3 py-1 font-mono text-gray-900">{toRupiah(kegmitra.jumlah)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-xs px-3 py-2 text-gray-500 border-t border-gray-300">
                        Tidak ada data kegiatan tahun {currentYear}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

            </div>
          </div>
          <div className="card border border-gray-400 rounded">
            <div className="text-xs font-semibold rounded-t bg-blue-600 text-white uppercase px-4 py-2 border-b-2 border-blue-700">Presentase Kegiatan Per Tim</div>
            <div className="card-body p-3">
              <PieChart
                series={[
                  {
                    arcLabel: (item) => `${item.value}`,
                    arcLabelMinAngle: 35,
                    arcLabelRadius: '60%',
                    data: kegiatanByTim,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  },
                ]}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fontWeight: 'bold',
                  },
                }}
                height={200}
                width={200}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
