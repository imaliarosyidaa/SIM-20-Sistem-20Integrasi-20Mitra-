import React, { useEffect, useState } from "react";
import batasHonorApi from "@/lib/honorApi";
import filesApi from "@/lib/filesApi";
import useAuth from "@/hooks/use-auth";
import useHonorApi from "@/lib/honorApi";
import useFilesApi from "@/lib/filesApi";

export default function Index() {
  const [batasHonor, setBatasHonor] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { auth } = useAuth();
  const { batasHonorBulanan } = useHonorApi();
  const { getFiles, streamDoc } = useFilesApi();

  useEffect(() => {
    async function getData() {
      batasHonorBulanan().then((batasHonor) => { setBatasHonor(batasHonor) })
        .catch(() => { setError(true) })
        .finally(() => { setIsLoading(false) })
    }

    async function getFilesData() {
      getFiles().then((file) => { setFiles(file) })
        .catch(() => { setError(true) })
        .finally(() => { setIsLoading(false) })
    }

    getData();
    getFilesData();
  }, []);

  async function streamDocData(filename: string) {
    streamDoc(filename).then((url) => { window.open(url, "_blank", "noopener,noreferrer"); })
      .catch((err) => { setError(true) })
      .finally(() => { setIsLoading(false) })
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex items-center">
        <p className="font-semibold whitespace-nowrap mr-4">
          Batas Honor Mitra
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {Array.from({ length: batasHonor?.length }).map((_, i) => (
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
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {Array.from({ length: files?.length }).map((_, i) => (
          <a className="relative bg-gray-900 block p-6 border border-gray-100 rounded-lg mx-auto hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
            <div className="my-4">
              <h2 className="text-white text-2xl font-bold pb-2">{files[i].description}</h2>
              <p className="text-gray-300 py-1">{files[i].originalName}</p>
            </div>
            <div className="flex justify-end">
              <button className=" px-2 py-1 text-white border border-gray-200 font-semibold rounded hover:bg-gray-800" onClick={() => streamDocData(files[i].filename)}
              >Lihat Dokumen</button>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
