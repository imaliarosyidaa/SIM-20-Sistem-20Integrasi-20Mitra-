import React, { useEffect, useState } from 'react';
import useKeuanganApi from '@/lib/keuanganApi';
import { Link } from 'react-router-dom';
import useAuth from '@/hooks/use-auth';
import { KeuanganForm } from '@/interfaces/types';
import { Alert, Snackbar, SnackbarCloseReason } from '@mui/material';

export default function Keuangan() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [keuangan, setKeuangan] = useState<[]>([]);
    const {
        getAllKeuangan,
        createKeuangan,
        updateByPPK,
        updateByPPSPM,
        updateByBendahara,
        updateByUmum
    } = useKeuanganApi()
    const [value, setValue] = useState("");
    const [expandCard, setExpandCard] = useState(null)
    const [openButton, setOpenButton] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [updateData, setUpdateData] = useState<any>()
    const [formData, setFormData] = useState<KeuanganForm>({
        id: null,
        tim: "",
        bulan_kegiatan: "",
        group_pok: "",
        detail: "",
        nomor_permintaan: 0,
        deskripsi: "",
        nomor_surat: "",
        tipe_form: "",
        dibuat_oleh: "",
        jumlah_usulan: 0,
        link_scan: "",
        bulan_pembayaran: "",
        teknis_kirim_ke_umum: null,
    })
    const { auth } = useAuth();
    const roles = auth?.roles || [];

    const hasRole = (roleName) => roles.includes(roleName);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = keuangan?.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(keuangan?.length / itemsPerPage);
    const [open, setOpen] = React.useState(false);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getKeuangan = async function getData() {
        setIsLoading(true);

        getAllKeuangan().then((res) => {
            setKeuangan(res);
        }).catch((err) => {
            console.error("Fetch error:", err);
            setKeuangan([]);
        })
            .finally(() => { setIsLoading(false) })
    };

    const handleChangeUpdate = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        id: number
    ) => {
        const { name, value, type } = e.target;

        setUpdateData((prev: any) => ({
            ...prev,
            id: id,
            [name]:
                type === "number" ? Number(value)
                    : type === "datetime-local" ? new Date(e.target.value).toISOString()
                        : value 
        }));
    };
    const handleFormUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        if (!updateData || !updateData.id) {
            setError("Gagal: ID data tidak ditemukan.");
            setIsLoading(false);
            return;
        }

        const dataToSend = { ...updateData };

        Object.keys(dataToSend).forEach(key => {
            if (dataToSend[key] === "") {
                dataToSend[key] = null;
            }
        });
        console.log(dataToSend)

        try {
            if (hasRole('PPK')) {
                await updateByPPK(dataToSend.id, dataToSend);
            } else if (hasRole('PPSPM')) {
                await updateByPPSPM(dataToSend.id, dataToSend);
            } else if (hasRole('Bendahara')) {
                await updateByBendahara(dataToSend.id, dataToSend);
            } else if (hasRole('Umum')) {
                await updateByUmum(dataToSend.id, dataToSend);
            }

            await getKeuangan();
            setSuccess("Data berhasil diperbarui!");
            window.scrollTo({ top: 0, behavior: "smooth" });
            setUpdateData({});

        } catch (err: any) {
            console.error("Submit Error:", err);
            setError(err.response?.data?.message || `Terjadi kesalahan saat update data.`);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData((prev: any) => ({
            ...prev,
            [name]:
                type === "number" ? Number(value) :
                    type === "datetime-local" ? value :
                        value
        }));
    };

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return local.toISOString().slice(0, 16);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        const dataToSend = { ...formData };

        dataToSend.jumlah_usulan = Number(dataToSend.jumlah_usulan) || 0;
        dataToSend.nomor_permintaan = Number(dataToSend.nomor_permintaan) || 0;

        try {
            await createKeuangan(dataToSend);
            setSuccess("Kegiatan berhasil ditambahkan!");
            setFormData({
                id: null,
                tim: "",
                bulan_kegiatan: "",
                group_pok: "",
                detail: "",
                nomor_permintaan: 0,
                deskripsi: "",
                nomor_surat: "",
                tipe_form: "",
                dibuat_oleh: "",
                jumlah_usulan: 0,
                link_scan: "",
                bulan_pembayaran: "",
                teknis_kirim_ke_umum: null,
            });
            getKeuangan();
            window.scrollTo({ top: 0, behavior: "smooth" });
            setOpen(true)
        } catch (err: any) {
            console.error("Submit Error:", err);
            setError(err.response?.data?.message || `Terjadi kesalahan (500 Internal Server Error). Cek konsol. Status: ${err.response?.status}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
            setOpen(true)
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    useEffect(() => {
        getKeuangan()
    }, []);
    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Keuangan</h3>
            </div>
            <button
                onClick={() => setExpandCard(prev => !prev)}
                className="flex items-center justify-center gap-2 w-48 h-12 border-2 border-dashed border-gray-300 text-gray-400 rounded-lg hover:border-gray-400 hover:text-gray-600 transition"
            >
                <span className="text-xl">＋</span>
                <span className="font-medium">Tambah Data</span>
            </button>
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {success ? success : error}
                </Alert>
            </Snackbar>

            {expandCard && (
                <div className="mt-4 bg-gray-100 p-6 rounded-lg bg-gray-200">
                    <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold">Tim</label>
                            <input
                                onChange={handleChangeForm}
                                value={formData?.tim}
                                type="text"
                                name="tim"
                            />

                            <label className="text-sm font-semibold">Bulan Kegiatan</label>
                            <input
                                onChange={handleChangeForm}
                                type="text"
                                name="bulan_kegiatan"
                                value={formData?.bulan_kegiatan}
                            />

                            <label className="text-sm font-semibold">Group POK</label>
                            <input
                                onChange={handleChangeForm}
                                type="text"
                                name="group_pok"
                                value={formData?.group_pok}
                            />

                            <label className="text-sm font-semibold">Detail</label>
                            <input
                                onChange={handleChangeForm}
                                type="text"
                                name="detail"
                                value={formData?.detail}
                            />

                            <label className="text-sm font-semibold">Nomor Permintaan</label>
                            <input
                                onChange={handleChangeForm}
                                type="number"
                                name="nomor_permintaan"
                                value={formData?.nomor_permintaan || ""}
                            />

                            <label className="text-sm font-semibold">Deskripsi</label>
                            <input
                                onChange={handleChangeForm}
                                type="text"
                                name="deskripsi"
                                value={formData?.deskripsi}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold">Nomor Surat</label>
                            <input
                                onChange={handleChangeForm}
                                type="text"
                                name="nomor_surat"
                                value={formData?.nomor_surat}
                            />

                            <label className="text-sm font-semibold">Tipe Form</label>
                            <input
                                onChange={handleChangeForm}
                                type="text"
                                name="tipe_form"
                                value={formData?.tipe_form}
                            />

                            <label className="text-sm font-semibold">Dibuat Oleh</label>
                            <input
                                onChange={handleChangeForm}
                                type="text"
                                name="dibuat_oleh"
                                value={formData?.dibuat_oleh}
                            />

                            <label className="text-sm font-semibold">Jumlah Usulan</label>
                            <input
                                onChange={handleChangeForm}
                                type="number"
                                name="jumlah_usulan"
                                value={formData?.jumlah_usulan || ""}
                            />

                            <label className="text-sm font-semibold">Link Scan</label>
                            <input
                                onChange={handleChangeForm}
                                type="url"
                                name="link_scan"
                                value={formData?.link_scan}
                            />

                            <label className="text-sm font-semibold">Bulan Pembayaran</label>
                            <input
                                onChange={handleChangeForm}
                                type="text"
                                name="bulan_pembayaran"
                                value={formData?.bulan_pembayaran}
                            />

                            <label className="text-sm font-semibold">Teknis Kirim ke Umum</label>
                            <input
                                type="datetime-local"
                                name="teknis_kirim_ke_umum"
                                value={formatDateForInput(formData.teknis_kirim_ke_umum)}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        teknis_kirim_ke_umum: new Date(e.target.value).toISOString(),
                                    })
                                }
                            />
                        </div>
                        <button
                            type='submit'
                            className={`md:col-span-2 py-2 px-4 rounded font-bold transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Mengirim...' : 'Submit'}
                        </button>
                    </form>
                </div>
            )}
            <div className='overflow-x-auto '>
                <table className="min-w-full border border-gray-300 divide-y divide-gray-300 divide-x bg-white">
                    <thead className='lg:text-normal text-xs uppercase bg-[#FFB422] dark:text-white'>
                        <tr>
                            <th className="px-1 py-2 border border-black">No.</th>
                            <th className="px-1 py-2 border border-black">Tim</th>
                            <th className="px-1 py-2 border border-black">Bulan Kegiatan</th>
                            <th className="px-1 py-2 border border-black">Group POK</th>
                            <th className="px-1 py-2 border border-black">Detail</th>
                            <th className="px-1 py-2 border border-black">No. Permintaan</th>
                            <th className="px-1 py-2 border border-black">Deskripsi</th>
                            <th className="px-1 py-2 border border-black">No. Surat</th>
                            <th className="px-1 py-2 border border-black">Tipe Form</th>
                            <th className="px-1 py-2 border border-black">Jumlah Usulan</th>
                            <th className="px-1 py-2 border border-black">Dibuat Oleh</th>
                            <th className="px-1 py-2 border border-black">Link Scan</th>
                            <th className="px-1 py-2 border border-black">B. Bayar</th>
                            <th className="px-1 py-2 border border-black">Teknis Kirim ke Umum</th>
                            <th className="px-1 py-2 border border-black w-36">PPK</th>
                            <th className="px-1 py-2 border border-black w-36">PPSPM</th>
                            <th className="px-1 py-2 border border-black w-36">Bendahara</th>
                            <th className="px-1 py-2 border border-black w-36">Umum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
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
                                    </tr>
                                ))}
                            </>
                        ) : currentItems?.length > 0 ? (
                            currentItems.map((keug, index) => (
                                <React.Fragment key={index}>
                                    <tr
                                        className="cursor-default hover:bg-purple-50 transition-colors cursor-pointer"
                                    >
                                        <td className="py-2 lg:text-normal border-r border-gray-200 text-xs font-semibold">
                                            {indexOfFirstItem + index + 1}.
                                        </td>
                                        <td className="py-2 lg:text-normal border-r border-gray-200 text-xs text-black font-semibold">
                                            {keug?.tim}
                                        </td>
                                        <td className="py-2 lg:text-normal border-r border-gray-200 text-xs text-black font-semibold">
                                            {keug?.bulan_kegiatan}
                                        </td>
                                        <td className="py-2 lg:text-normal border-r border-gray-200 text-xs text-black font-semibold">
                                            {keug?.group_pok}
                                        </td>
                                        <td className="py-2 lg:text-normal border-r border-gray-200 text-xs text-black font-semibold">
                                            {keug?.detail}
                                        </td>
                                        <td className="py-2 lg:text-normal border-r border-gray-200 text-xs text-black font-semibold">
                                            {keug?.nomor_permintaan}
                                        </td>
                                        <td className="py-2 lg:text-normal border-r border-gray-200 text-xs text-black font-semibold">
                                            {keug?.deskripsi}
                                        </td>
                                        <td className="py-2 lg:text-normal border-r border-gray-200 text-xs text-black font-semibold">
                                            {keug?.nomor_surat}
                                        </td>
                                        <td className="py-2 lg:text-normal border-r border-gray-200 text-xs text-black font-semibold">
                                            {keug?.tipe_form}
                                        </td>
                                        <td className="py-2 lg:text-normal border-r border-gray-200 text-xs text-black font-semibold">
                                            {keug?.dibuat_oleh}
                                        </td>
                                        <td className="py-2 lg:text-normal border-r border-gray-200 text-xs text-black font-semibold">
                                            {keug?.jumlah_usulan}
                                        </td>
                                        <td className="py-2 lg:text-normal border-r border-gray-200 text-xs text-black font-semibold">
                                            {keug?.link_scan ? (
                                                <Link to={keug?.link_scan} className=''>Lihat</Link>
                                            ) : "tidak ada"}
                                        </td>
                                        <td className="py-2 lg:text-normal border-r border-gray-200 text-xs text-black font-semibold">
                                            {keug?.bulan_pembayaran}
                                        </td>
                                        <td className="py-2 lg:text-normal border-r border-gray-200 text-xs text-black font-semibold">
                                            {keug?.teknis_kirim_ke_umum}
                                        </td>
                                        <td className="py-2 text-sm text-black font-semibold border-r border-gray-200">
                                            <form onSubmit={handleFormUpdate} >
                                                <input type="hidden" name="id" value={keug.id} />
                                                <label className='text-xs lg:text-normal text-black font-semibold'>PPPK Cek Dokumen</label>
                                                <input
                                                    type="text"
                                                    name="ppk_cek_dokumen"
                                                    placeholder="Cek Dokumen"
                                                    disabled={!hasRole("PPK")}
                                                    value={updateData?.ppk_cek_dokumen || keug.ppk_cek_dokumen || ""}
                                                    onChange={(e) => handleChangeUpdate(e, keug.id)}
                                                />
                                                <label className='text-xs lg:text-normal text-black font-semibold'>Kirim ke PPSPM</label>
                                                <input
                                                    type="datetime-local"
                                                    name="ppk_kirim_ke_ppspm"
                                                    placeholder="Kirim ke PPSPM"
                                                    className={`pl-2 rounded my-1 w-full ${hasRole("PPK") ? "bg-white text-black border" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                                                    disabled={!hasRole("PPK")}
                                                    value={formatDateForInput(updateData?.ppk_kirim_ke_ppspm || keug.ppk_kirim_ke_ppspm)}
                                                    onChange={(e) => handleChangeUpdate(e, keug.id)}
                                                />

                                                {hasRole("PPK") && (
                                                    <div className="text-center mt-2">
                                                        <button
                                                            type="submit"
                                                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded text-xs"
                                                        >
                                                            Simpan
                                                        </button>
                                                    </div>
                                                )}
                                            </form>
                                        </td>
                                        <td className="py-2 text-sm text-black font-semibold border-r border-gray-200">
                                            <form onSubmit={handleFormUpdate} >
                                                <input type="hidden" name="id" value={keug.id} />
                                                <label className='text-xs lg:text-normal text-black font-semibold'>PPSPM Cek Dokumen</label>
                                                <input
                                                    type="text"
                                                    name="ppspm_cek_dokumen"
                                                    placeholder="Cek Dokumen"
                                                    disabled={!hasRole("PPSPM")}
                                                    value={updateData?.ppspm_cek_dokumen || keug.ppspm_cek_dokumen || ""}
                                                    onChange={(e) => handleChangeUpdate(e, keug.id)}
                                                />
                                                <label className='text-xs lg:text-normal text-black font-semibold'>Kirim ke Bendahara</label>
                                                <input
                                                    type="datetime-local"
                                                    name="ppspm_kirim_ke_bendahara"
                                                    placeholder="Kirim ke Bendahara"
                                                    className={`pl-2 rounded my-1 w-full ${hasRole("Bendahara") ? "bg-white text-black border" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                                                    disabled={!hasRole("PPSPM")}
                                                    value={formatDateForInput(updateData?.ppspm_kirim_ke_bendahara || keug.ppspm_kirim_ke_bendahara)}
                                                    onChange={(e) => handleChangeUpdate(e, keug.id)}
                                                />

                                                {hasRole("PPSPM") && (
                                                    <div className="text-center mt-2">
                                                        <button
                                                            type="submit"
                                                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded text-xs"
                                                        >
                                                            Simpan
                                                        </button>
                                                    </div>
                                                )}
                                            </form>
                                        </td>
                                        <td className="py-2 text-sm text-black font-semibold border-r border-gray-200">
                                            <form onSubmit={handleFormUpdate} >
                                                <input type="hidden" name="id" value={keug.id} />
                                                <label className='text-xs lg:text-normal text-black font-semibold'>Bendahara Bayar</label>
                                                <input
                                                    type="text"
                                                    name="bendahara_bayar"
                                                    placeholder="Cek Dokumen"
                                                    disabled={!hasRole("Bendahara")}
                                                    value={updateData?.bendahara_bayar || keug.bendahara_bayar || ""}
                                                    onChange={(e) => handleChangeUpdate(e, keug.id)}
                                                />
                                                <label className='text-xs lg:text-normal text-black font-semibold'>No SPP</label>
                                                <input
                                                    type="text"
                                                    name="no_spp"
                                                    placeholder="Cek Dokumen"
                                                    disabled={!hasRole("Bendahara")}
                                                    value={updateData?.no_spp || keug.no_spp || ""}
                                                    onChange={(e) => handleChangeUpdate(e, keug.id)}
                                                />
                                                <label className='text-xs lg:text-normal text-black font-semibold'>Tanggal SPP</label>
                                                <input
                                                    type="datetime-local"
                                                    name="tanggal_spp"
                                                    placeholder="Kirim ke Bendahara"
                                                    className={`pl-2 rounded my-1 w-full ${hasRole("Bendahara") ? "bg-white text-black border" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                                                    disabled={!hasRole("Bendahara")}
                                                    value={formatDateForInput(updateData?.tanggal_spp || keug.tanggal_spp)}
                                                    onChange={(e) => handleChangeUpdate(e, keug.id)}
                                                />

                                                {hasRole("Bendahara") && (
                                                    <div className="text-center mt-2">
                                                        <button
                                                            type="submit"
                                                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded text-xs"
                                                        >
                                                            Simpan
                                                        </button>
                                                    </div>
                                                )}
                                            </form>
                                        </td>
                                        <td className="py-2 text-sm text-black font-semibold border-r border-gray-200">
                                            <form onSubmit={handleFormUpdate} >
                                                <input type="hidden" name="id" value={keug.id} />
                                                <label className='text-xs lg:text-normal text-black font-semibold'>Rekap Bos</label>
                                                <input
                                                    type="text"
                                                    name="rekap_bos"
                                                    placeholder="Cek Dokumen"
                                                    disabled={!hasRole("Umum")}
                                                    value={updateData?.rekap_bos || keug.rekap_bos || ""}
                                                    onChange={(e) => handleChangeUpdate(e, keug.id)}
                                                />
                                                <label className='text-xs lg:text-normal text-black font-semibold'>Realisasi Bos</label>
                                                <input
                                                    type="text"
                                                    name="realisasi_bos"
                                                    placeholder="Cek Dokumen"
                                                    disabled={!hasRole("Umum")}
                                                    value={updateData?.realisasi_bos || keug.realisasi_bos || ""}
                                                    onChange={(e) => handleChangeUpdate(e, keug.id)}
                                                />

                                                {hasRole("Umum") && (
                                                    <div className="text-center mt-2">
                                                        <button
                                                            type="submit"
                                                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded text-xs"
                                                        >
                                                            Simpan
                                                        </button>
                                                    </div>
                                                )}
                                            </form>
                                        </td>
                                    </tr>
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