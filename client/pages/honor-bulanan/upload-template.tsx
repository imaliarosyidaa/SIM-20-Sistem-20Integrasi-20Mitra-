import React, { useEffect, useState } from "react";
import axios, { axiosPrivate } from '../../lib/api';
import kegaiatanMitraApi from "@/lib/kegaiatanMitraApi";
import useAuth from "@/hooks/use-auth";
import filesApi from "@/lib/filesApi";
import useFilesApi from "@/lib/filesApi";
import useKegiatanMitraApi from "@/lib/kegaiatanMitraApi";
import { Alert } from "@mui/material";

export default function UploadTemplate() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataValidated, setIsDataValidated] = useState(false);
    const [error, setError] = useState(null);
    const [files, setFiles] = useState([]);
    const [file, setFile] = useState();
    const { getFiles, streamDoc } = useFilesApi()
    const { unggahFileTemplate, kirimFileTemplate } = useKegiatanMitraApi()

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setPreviewData(null);
        setIsDataValidated(false);
        setError(null);
    };

    const handleUploadClick = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setError("Silakan pilih file terlebih dahulu.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        unggahFileTemplate(formData).then((response) => {
            setPreviewData(response);
            setIsDataValidated(true);
            setError(null);
        })
            .catch((err) => {
                if (!err?.response) {
                    setError('No Server Response');
                } else if (err.response?.status === 400) {
                    setError(err.response?.data.message);
                    setSelectedFile(null)
                } else {
                    setError('Gagal Mengunggah File');
                }
                setPreviewData(null);
                setIsDataValidated(false);
                setTimeout(() => {
                    window.location.reload();
                }, 3500);
            })
            .finally(() => { setIsLoading(false) })
    };

    const handleSaveClick = async () => {
        setIsLoading(true);
        setError(null);

        kirimFileTemplate(previewData).then(() => {
            alert('Data berhasil disimpan ke database!');
            setSelectedFile(null);
            setPreviewData(null);
            setIsDataValidated(false);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        })
            .catch((err) => {
                console.error('Penyimpanan gagal:', err);
                const errorMessage = error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi.';
                setError(errorMessage);
            })
            .finally(() => { setIsLoading(false) })
    };

    useEffect(() => {
        getFilesData();
    }, []);

    async function getFilesData() {

        getFiles().then((res) => {
            if (Array.isArray(res)) {
                setFiles(res);
                const templateFile = res?.find(
                    (item) =>
                        item.originalName.toLowerCase().includes("template kegiatan mitra")
                );

                if (templateFile) {
                    console.log("Template ditemukan:", templateFile);
                    setFile(templateFile);
                } else {
                    setFile(null);
                }
            } else {
                setFiles([]);
                setFile(null);
            }
        })
            .catch((err) => {
                console.error("Gagal mengambil data:", err);
                setFiles([]);
                setFile(null);
            })
            .finally(() => { setIsLoading(false) })
    }

    function handleDownload(filename: string) {
        streamDocData(filename);
    }

    async function streamDocData(filename: string) {
        streamDoc(filename).then((url) => {
            window.open(url, "_blank", "noopener,noreferrer");
        })
            .catch((err) => { console.error("Gagal mengambil data:", err); })
            .finally(() => { setIsLoading(false) })
    }

    return (
        <div className="space-y-6 p-6 w-full">
            <div className="max-w-none mx-auto w-full">
                {error && <Alert variant="filled" severity="error" className='w-fit bottom-4 right-4 absolute z-10'>{error}</Alert>}
                <div className="bg-white border rounded-md p-4 px-4 md:p-8 mb-6 w-full">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                        <div className="text-gray-600">
                            <p className="font-medium text-lg">Upload Template</p>
                            <a
                                href='https://docs.google.com/spreadsheets/d/1HmOYguIGxyDqbUUdrPA3_jzx6okcvbhaz2SExa8ykiM/edit?usp=sharing'
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="w-fit flex mt-4 items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-cloud-arrow-down-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708" />
                                </svg>
                                <span>Download Template</span>
                            </a>

                        </div>

                        <div className="lg:col-span-2">
                            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1">
                                <form onSubmit={handleUploadClick}>
                                    <div className="md:col-span-5">
                                        <label htmlFor="file" className="form-label">Upload File Excel/csv<span className="text-red-500">*</span></label>
                                        <input
                                            type="file"
                                            name="file"
                                            id="file"
                                            className="form-control"
                                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div className="md:col-span-5 text-right mt-4">
                                        <div className="inline-flex items-end gap-2">
                                            <button
                                                type="submit"
                                                disabled={!selectedFile || isLoading || isDataValidated}
                                                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${!selectedFile || isLoading || isDataValidated ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                            >
                                                {isLoading ? 'Mengunggah...' : 'Unggah'}
                                            </button>
                                            {isDataValidated && (
                                                <button
                                                    type="button"
                                                    onClick={handleSaveClick}
                                                    disabled={isLoading}
                                                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                                                >
                                                    Simpan
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </form>


                            </div>
                        </div>
                    </div>
                </div>
                {previewData && Array.isArray(previewData) && previewData.length > 0 && (
                    <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                                    Pratinjau Data
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Menampilkan {previewData.length} baris pertama dari file Anda.
                                </p>
                            </div>
                            <div className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
                                Excel Verified
                            </div>
                        </div>

                        <div className="relative overflow-hidden border border-gray-200 shadow-xl rounded-xl bg-white">
                            <div className="overflow-x-auto max-h-96">
                                <table className="w-full text-sm text-left">
                                    <thead className="sticky top-0 z-10">
                                        <tr className="bg-gray-50/90 backdrop-blur-md border-b border-gray-200">
                                            <th scope="col" className="px-6 py-4 font-semibold text-gray-700 uppercase tracking-wider text-[11px] w-16">
                                                No
                                            </th>
                                            {Object.keys(previewData[0]).map((key) => (
                                                <th
                                                    key={key}
                                                    scope="col"
                                                    className="px-6 py-4 font-semibold text-gray-700 uppercase tracking-wider text-[11px]"
                                                >
                                                    {key.replace(/_/g, ' ')}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {previewData.map((row, i) => (
                                            <tr key={i} className="group transition-colors hover:bg-blue-50/30">
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-400 font-mono text-xs">
                                                    {i + 1}
                                                </td>

                                                {Object.values(row).map((val, j) => (
                                                    <td key={j} className="px-6 py-4 whitespace-nowrap">
                                                        {val === null || val === undefined || val === '' ? (
                                                            <span className="text-gray-300 italic text-xs">Kosong</span>
                                                        ) : (
                                                            <span className="text-gray-600 group-hover:text-blue-700 transition-colors font-medium">
                                                                {String(val)}
                                                            </span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
                                <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                                    Sipadu Data Preview Engine v1.0
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}