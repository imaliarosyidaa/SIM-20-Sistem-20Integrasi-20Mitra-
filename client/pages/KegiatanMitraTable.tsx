import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from '../lib/api'
import kegiatanMitraApi from '../lib/kegaiatanMitraApi'
import Skeleton from 'react-loading-skeleton';
import kegiatanApi from '@/lib/kegiatanApi';
import useAuth from '@/hooks/use-auth';

export default function KegiatanMitraTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    const [expandedRowData, setExpandedRowData] = useState([]);
    const [isLoadingExpandedRow, setIsLoadingExpandedRow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [mitraxkegaiatan, setMitraXKegiatan] = useState([]);
    const { auth } = useAuth();

    const filteredItems = mitraxkegaiatan.filter(item =>
        item.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const getKegiatanById = async (id) => {
        setIsLoadingExpandedRow(true);

        kegiatanMitraApi.GetKegiatanById(auth.accessToken, id).then((res) => {
            setExpandedRowData(res.KegiatanMitra);
        })
            .catch((err) => {
                console.error("Failed to fetch kegiatan data:", err);
                setExpandedRowData([]);
            })
            .finally(() => {
                setIsLoading(false)
                setIsLoadingExpandedRow(false);
            })
    };

    const handleRowClick = (id) => {
        if (expandedRow === id) {
            setExpandedRow(null);
            setExpandedRowData([]);
        } else {
            setExpandedRow(id);
            getKegiatanById(id);
        }
    };

    const getJumlahKegiatanMitra = async function getData(year) {
        setIsLoading(true);

        kegiatanMitraApi.GetJumlahKegiatanMitra(auth.accessToken, year).then((res) => {
            setMitraXKegiatan(res);
        })
            .catch((err) => {
                console.error("Fetch error:", err);
                setMitraXKegiatan([]);
            })
            .finally(() => {
                setIsLoading(false)
            })
    };

    useEffect(() => {
        getJumlahKegiatanMitra(currentYear)
    }, []);

    return (
        <div className="">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Jumlah Kegiatan Mitra</h3>
                {/* Search Input */}
                <div className='flex gap-4'>
                    <select
                        id="tahun"
                        value={selectedYear}
                        onChange={(e) => {
                            const year = Number(e.target.value);
                            setSelectedYear(year);
                            getJumlahKegiatanMitra(year);
                        }}
                        className="border rounded px-3 py-2"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Cari nama mitra..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">No.</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Nama Mitra</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Jumlah Kegiatan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            // Skeleton loader saat loading utama
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
                                    </tr>
                                ))}
                            </>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((kegmitra, index) => (
                                <React.Fragment key={index}>
                                    <tr
                                        onClick={() => handleRowClick(kegmitra.id)}
                                        className="cursor-default hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {indexOfFirstItem + index + 1}.
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {kegmitra.namaLengkap}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {kegmitra.jumlahKegiatan}
                                        </td>
                                    </tr>

                                    {/* Expanded content row */}
                                    {expandedRow === kegmitra.id && (
                                        <tr>
                                            <td colSpan="4" className="p-4 bg-gray-100">
                                                {isLoadingExpandedRow ? (
                                                    <div className="text-center text-gray-500">
                                                        Memuat list kegiatan...
                                                    </div>
                                                ) : (
                                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                                        {expandedRowData.length > 0 ? (
                                                            expandedRowData.map((kegiatan, kIndex) => (
                                                                <li key={kIndex}>
                                                                    Kegiatan: {kegiatan.nama_survei} ({kegiatan.bulan})
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <div className="text-gray-500">
                                                                Tidak ada kegiatan ditemukan.
                                                            </div>
                                                        )}
                                                    </ul>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                                    Tidak ada data yang ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between items-center">
                <div>
                    <span className="text-sm text-gray-600">
                        Halaman {currentPage} dari {totalPages}
                    </span>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-700 disabled:opacity-50"
                    >
                        &lt;&lt;
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-700 disabled:opacity-50"
                    >
                        &lt;
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-700 disabled:opacity-50"
                    >
                        &gt;
                    </button>
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-700 disabled:opacity-50"
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>
        </div>
    );
}