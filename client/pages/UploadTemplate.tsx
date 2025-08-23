import React, { useState, useEffect } from "react";
import axios from '../lib/api'

export default function UploadTemplate() {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert("Silakan pilih file terlebih dahulu.");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post(
                'http://localhost:3000/kegiatanmitra/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log('Upload berhasil:', response.data);
            alert('File berhasil diunggah!');
            setSelectedFile(null);
        } catch (error) {
            console.error('Upload gagal:', error);
            alert('Gagal mengunggah file. Silakan coba lagi.');
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
                                    onClick={() => {
                                        window.location.href = "/template.xlsx";
                                    }}
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
                                    <form onSubmit={(e) => handleFormSubmit(e)} method="POST">
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
                                        <div className="md:col-span-5 text-right">
                                            <div className="inline-flex items-end">
                                                <button type="submit" className="flex mt-4 items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
