import React, { useCallback, useEffect, useState } from "react";
import batasHonorApi from "@/lib/honorApi";
import filesApi from "@/lib/filesApi";
import useAuth from "@/hooks/use-auth";
import useHonorApi from "@/lib/honorApi";
import useFilesApi from "@/lib/filesApi";
import { RotateCcw } from "lucide-react";
import { months } from '../constants'
import useKegiatanMitraApi from "@/lib/kegaiatanMitraApi";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts";
import useKegiatanApi from "@/lib/kegiatanApi";
import circle_image from '../assets/circle.svg'
import clsx from "clsx";

export default function Index() {

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const currentYear = new Date().getFullYear();
  const [idSobat, setIdSobat] = useState('');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [rekapHonorPerBulan, setRekapHonorPerBulan] = useState([]);
  const [rincianKegiatan, setRincianKegiatan] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
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

  const filteredItems = (rekapHonorPerBulan || []).filter(item =>
    (item?.namaLengkap || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetFilters = () => {
    setSelectedYear(currentYear);
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
      console.log(res.total)
    }).catch((err) => {
      console.error("gagal mengambil data", err);
    })
      .finally(() => { setIsLoading(false) })
  }, [selectedMonth]);

  useEffect(() => {
    if (selectedMonth && selectedMonth) {
      getRekapHonorPerBulanData(selectedYear, selectedMonth, idSobat)
    }
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
    <div className="space-y-4 lg:space-y-6 p-6">
      {/* Card Bootsrap */}
      <div className="row">
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-danger card-img-holder text-white">
            <div className="card-body">
              <img src={circle_image} className="card-img-absolute" alt="circle-image" />
              <h4 className="font-weight-semibold mb-3">Jumlah Kegiatan <i className="mdi mdi-chart-line mdi-24px float-end"></i>
              </h4>
              <h2 className="mb-2 text-4xl">{rincianKegiatan?.countKegiatanMitra}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-info card-img-holder text-white">
            <div className="card-body">
              <img src={circle_image} className="card-img-absolute" alt="circle-image" />
              <h4 className="font-weight-semibold mb-3">Jumlah Mitra <i className="mdi mdi-bookmark-outline mdi-24px float-end"></i>
              </h4>
              <h2 className="mb-2 text-4xl">{rincianKegiatan?.countMitra.toLocaleString("id-ID")}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-success card-img-holder text-white">
            <div className="card-body">
              <img src={circle_image} className="card-img-absolute" alt="circle-image" />
              <h4 className="font-weight-semibold mb-3">Total Honor <i className="mdi mdi-diamond mdi-24px float-end"></i>
              </h4>
              <h2 className="mb-2 text-4xl">{selectedMonth ? toRupiah(honorPerbulan) : toRupiah(rincianKegiatan?.sumHonor)}</h2>
            </div>
          </div>
        </div>
      </div>
      {/* End Card Bootstrap */}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            id="tahun"
            value={selectedYear}
            onChange={(e) => {
              const year = Number(e.target.value);
              setSelectedYear(year);
              getRekapHonorPerBulanData(year, selectedMonth, idSobat);
            }}
            className="border rounded px-3 py-2"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
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
            className="border rounded px-3 py-2"
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
          className="flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset Filter
        </button>
      </div>

      <div className="row">
        <div className="col-md-7 grid-margin">
          <div className="">
            <div className="">
              <h4 className="mb-3">10 Mitra dengan Honor Tertinggi</h4>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white rounded-md">
                <table className="w-full text-normal text-left rtl:text-right dark:text-blue-100">
                  <thead className="text-normal text-black uppercase bg-[#FFB422] dark:text-white">
                    <tr>
                      <th scope="col" className="px-6 py-2"> No. </th>
                      <th scope="col" className="px-6 py-2"> Nama Mitra </th>
                      <th scope="col" className="px-6 py-2"> Jumlah Kegiatan </th>
                      <th scope="col" className="px-6 py-2"> Honor </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <>
                        {[...Array(10)].map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td className="px-4 py-2">
                              <div className="h-4 bg-gray-200 rounded w-6"></div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="h-4 bg-gray-200 rounded w-32"></div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : currentItems?.length > 0 ? (
                      currentItems.map((kegmitra, index) => (
                        <React.Fragment key={kegmitra.sobatId}>
                          <tr onClick={() => { handleClickRow(kegmitra.sobatId); setActiveRowId(kegmitra.sobatId) }}
                            className={clsx(
                              activeRowId === kegmitra.sobatId ? "bg-gray-200" : "bg-white",
                              "border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            )}>
                            <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {indexOfFirstItem + index + 1}.
                            </td>
                            <td scope="row" className="px-6 py-2 font-medium whitespace-nowrap dark:text-blue-100 capitalize">
                              {kegmitra.namaLengkap}
                            </td>
                            <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {kegmitra.jumlahKegiatan}
                            </td>
                            <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {kegmitra.honor.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td>
                          Tidak ada data yang ditemukan.
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
          <h4 className="mb-3">Rincian Honor Mitra Per Kegiatan</h4>
          <div className="mt-2 mb-4">
            <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white rounded-md block max-h-[490px]">
              <table className="text-sm w-full text-sm text-left dark:text-gray-400">
                <thead className="text-normal uppercase bg-[#FA4F58] text-black dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                  <tr>
                    <th scope="col" className="px-4 py-3">No.</th>
                    <th scope="col" className="px-2 py-3">Tim</th>
                    <th scope="col" className="px-4 py-3">Kegiatan</th>
                    <th scope="col" className="px-4 py-3">Honor</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-auto">
                  {isLoading ? (
                    <>
                      {[...Array(10)].map((_, i) => (
                        <tr key={i} className="animate-pulse text-xs">
                          <td className="px-2 py-1">
                            <div className="h-3 bg-gray-200 rounded w-4"></div>
                          </td>
                          <td className="px-2 py-1">
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </td>
                          <td className="px-2 py-1">
                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                          </td>
                          <td className="px-2 py-1">
                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : kegiatanMitra?.length > 0 ? (
                    kegiatanMitra?.map((kegmitra, index) => (
                      <tr key={index} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="px-4 py-2 text-normal font-medium">{indexOfFirstItem + index + 1}.</td>
                        <td className="px-2 py-2 text-normal font-medium">{kegmitra.tim}</td>
                        <td className="px-4 py-2 text-normal lg:text-xs font-medium">{kegmitra.nama_survei_sobat}</td>
                        <td className="px-4 py-2 text-normal font-medium">{toRupiah(kegmitra.jumlah)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-xs px-4 py-4 text-xs">
                        Tidak ada data yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

            </div>
          </div>
          <div className="card">
            <div className="text-normal rounded-t-md uppercase bg-[#4254FB] text-black dark:bg-gray-700 dark:text-gray-400 px-6 py-3 font-bold">Presentase Kegiatan Per Tim</div>
            <div className="card-body">
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
