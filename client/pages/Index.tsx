import React, { useEffect, useState } from "react";
import axios from '../lib/api'
import { axiosPrivate } from '../lib/api';

export default function Index() {
  const [batasHonor, setBatasHonor] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get('/batashonor');
        if (Array.isArray(res.data.data)) {
          setBatasHonor(res.data.data);
        } else {
          setBatasHonor([]);
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    }

    async function getFiles() {
      try {
        const res = await axios.get('/files/list');
        if (Array.isArray(res.data)) {
          setFiles(res.data);
        } else {
          setFiles([]);
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    }

    getData();
    getFiles();
  }, []);

  async function streamDoc(filename: string) {
    try {
      // cukup bikin URL ke backend
      const url = `${axiosPrivate.defaults.baseURL}/files/stream/${filename}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  }


  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex items-center">
        <p className="font-semibold whitespace-nowrap mr-4">
          Batas Honor Mitra
        </p>
        <hr className="border-t border-gray-300 w-full"></hr>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {Array.from({length: batasHonor.length}).map((_,i) =>(
        <div key={i} className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-6 hover:shadow-3xl transition-all duration-300 hover:scale-105">
          <div className="text-white">
              <>
                <h3 className="text-xl font-semibold mb-2"> Rp {(batasHonor[i]?.biaya || 0).toLocaleString("id-ID")}</h3>
                <p className="text-white/90">{batasHonor[i]?.keterangan || "Loading..."}</p>
              </>
          </div>
        </div>
        ))}
      </div>
      <div className="flex items-center">
        <p className="font-semibold whitespace-nowrap mr-4">
          Sumber
        </p>
        <hr className="border-t border-gray-300 w-full" />
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {Array.from({length: files.length}).map((_,i)=>(
          <a className="relative bg-gray-900 block p-6 border border-gray-100 rounded-lg mx-auto hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="my-4">
              <h2 className="text-white text-2xl font-bold pb-2">{files[i].description}</h2>
              <p className="text-gray-300 py-1">{files[i].originalName}</p>
            </div>
            <div className="flex justify-end">
              <button className=" px-2 py-1 text-white border border-gray-200 font-semibold rounded hover:bg-gray-800" onClick={() => streamDoc(file.filename)}
              >Lihat Dokumen</button>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
