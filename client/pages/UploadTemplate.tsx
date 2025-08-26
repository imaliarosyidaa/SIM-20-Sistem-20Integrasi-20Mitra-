import React, { useState } from "react";
import axios from '../lib/api';

export default function UploadTemplate() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataValidated, setIsDataValidated] = useState(false);
    const [error, setError] = useState(null);

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

        try {
            const response = await axios.post('/kegiatanmitra/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setPreviewData(response.data.data);
            setIsDataValidated(true);
            setError(null);
            alert(response.data.message);

        } catch (error) {
            console.error('Validasi gagal:', error);
            const errorMessage = error.response?.data?.message || 'Gagal memproses file. Silakan periksa formatnya.';
            setError(errorMessage);
            setPreviewData(null);
            setIsDataValidated(false);

        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveClick = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await axios.post('/kegiatanmitra/save', previewData);
            alert('Data berhasil disimpan ke database!');
            setSelectedFile(null);
            setPreviewData(null);
            setIsDataValidated(false);
        } catch (error) {
            console.error('Penyimpanan gagal:', error);
            const errorMessage = error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-screen-lg mx-auto">
                <div>
                    <div className="bg-white border rounded-md p-4 px-4 md:p-8 mb-6">
                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                            <div className="text-gray-600">
                                <p className="font-medium text-lg">Upload Template</p>
                                <button
                                    onClick={() => { window.location.href = "/template.xlsx"; }}
                                    className="flex mt-4 items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16">
                                        <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708" />
                                    </svg>
                                    <span>Download Template</span>
                                </button>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1">
                                    {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
                                    <form onSubmit={handleUploadClick}>
                                        <div className="md:col-span-5">
                                            <label htmlFor="file">Upload File Excel/csv<span className="text-red-500">*</span></label>
                                            <input
                                                type="file"
                                                name="file"
                                                id="file"
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
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
                    {previewData && Array.isArray(previewData) && (
                        <div className="mt-8">
                            <h3 className="font-medium text-lg mb-4">Pratinjau Data</h3>
                            <div className="overflow-x-auto relative shadow-lg sm:rounded-lg">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-normal uppercase bg-gray-50">
                                        <tr>
                                            {Object.keys(previewData[0]).map((key) => (
                                                <th key={key} scope="col" className="px-6 py-3 font-bold">
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.map((row, i) => (
                                            <tr key={i} className="bg-white border-b hover:bg-gray-50">
                                                {Object.values(row).map((val, j) => (
                                                    <td key={j} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                        {val}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}