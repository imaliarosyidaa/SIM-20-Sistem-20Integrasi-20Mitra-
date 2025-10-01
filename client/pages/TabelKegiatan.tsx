import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TabelKegiatan({ kegiatanMitra }) {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const totalPages = Math.ceil(kegiatanMitra?.length / rowsPerPage);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = kegiatanMitra?.slice(indexOfFirstRow, indexOfLastRow);

    const goToPage = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="overflow-hidden rounded-lg border shadow-sm">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2">No.</th>
                        <th className="p-2">Bulan</th>
                        <th className="p-2">Tanggal</th>
                        <th className="p-2">Tim</th>
                        <th className="p-2">Nama Survei</th>
                        <th className="p-2 text-left">Nama Survei Sobat</th>
                        <th className="p-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((kegiatan, index) => (
                        <tr
                            key={kegiatan.id}
                            className="border-t hover:bg-gray-50 transition"
                        >
                            <td className="p-2 text-center">
                                {indexOfFirstRow + index + 1}.
                            </td>
                            <td className="p-2 text-center text-normal">{kegiatan.bulan}</td>
                            <td className="p-2 text-center text-normal">{kegiatan.tanggal}</td>
                            <td className="p-2 text-center text-normal">{kegiatan.tim}</td>
                            <td className="p-2 text-center text-normal">{kegiatan.nama_survei}</td>
                            <td className="p-2 text-start text-normal text-blue-600 hover:underline cursor-pointer">
                                {kegiatan.nama_survei_sobat}
                            </td>
                            <td className="p-2 text-center">
                                <ChevronRight size={16} className="text-gray-500" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600">
                    Menampilkan{" "}
                    <span className="font-semibold">
                        {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, kegiatanMitra?.length)}
                    </span>{" "}
                    dari <span className="font-semibold">{kegiatanMitra?.length}</span> data
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center px-3 py-1.5 rounded-md border text-sm disabled:opacity-40 hover:bg-gray-100"
                    >
                        <ChevronLeft size={16} />
                        Prev
                    </button>
                    {/* Numbered buttons */}
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(i + 1)}
                            className={`px-3 py-1.5 rounded-md text-sm ${currentPage === i + 1
                                ? "bg-indigo-600 text-white"
                                : "border hover:bg-gray-100"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center px-3 py-1.5 rounded-md border text-sm disabled:opacity-40 hover:bg-gray-100"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
