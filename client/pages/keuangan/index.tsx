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
    const [expandedDetailCard, setExpandedDetailCard] = useState<number | null>(null)
    const [expandedRoleTab, setExpandedRoleTab] = useState<{ [key: number]: string }>({})
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

    const dummyData = {
        id: 999,
        tim: "Tim IT Development",
        bulan_kegiatan: "Januari 2026",
        group_pok: "IT Infrastructure",
        detail: "Database Modernization Project",
        nomor_permintaan: "REQ-2026-0001",
        deskripsi: "Upgrade Server & Network",
        nomor_surat: "SURAT-001/IT/2026",
        tipe_form: "Pengadaan Hardware",
        jumlah_usulan: 250000000,
        dibuat_oleh: "Admin IT",
        link_scan: "#",
        bulan_pembayaran: "Mei 2026",
        teknis_kirim_ke_umum: "Menunggu persetujuan",
        ppk_cek_dokumen: "Dokumen lengkap",
        ppk_kirim_ke_ppspm: new Date().toISOString(),
        ppspm_cek_dokumen: "Sudah diverifikasi",
        ppspm_kirim_ke_bendahara: new Date().toISOString(),
        bendahara_bayar: "Proses pembayaran",
        no_spp: "SPP-001/2026",
        tanggal_spp: new Date().toISOString(),
        rekap_bos: "Data lengkap",
        realisasi_bos: "Sudah direalisasi"
    };

    const getKeuangan = async function getData() {
        setIsLoading(true);

        getAllKeuangan().then((res) => {
            // Tambahkan dummy data di awal array
            setKeuangan([dummyData, ...res]);
        }).catch((err) => {
            console.error("Fetch error:", err);
            // Jika fetch error, tampilkan hanya dummy data
            setKeuangan([dummyData]);
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
        <div className="space-y-4 p-4 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900">Keuangan</h3>
            </div>
            <button
                onClick={() => setExpandCard(prev => !prev)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
            >
                <span className="text-lg">+</span>
                <span>Tambah Data</span>
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
                <div className="mt-4 bg-blue-50 p-6 rounded-lg border border-blue-200 shadow-sm">
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
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg border border-gray-300 p-4 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : currentItems?.length > 0 ? (
                <div className="space-y-3">
                    {currentItems.map((keug, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
                            <button
                                onClick={() => setExpandedDetailCard(expandedDetailCard === keug.id ? null : keug.id)}
                                className="w-full text-left p-4 hover:bg-blue-50 transition-colors flex justify-between items-center"
                            >
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div>
                                        <div className="text-xs text-gray-500 font-medium">No.</div>
                                        <div className="font-semibold text-gray-900">{indexOfFirstItem + index + 1}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 font-medium">Tim</div>
                                        <div className="font-semibold text-gray-900 truncate">{keug?.tim}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 font-medium">Bulan</div>
                                        <div className="font-semibold text-gray-900">{keug?.bulan_kegiatan}</div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="text-xs text-gray-500 font-medium">Detail</div>
                                        <div className="font-semibold text-gray-900 truncate">{keug?.detail}</div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="text-xs text-gray-500 font-medium">B. Bayar</div>
                                        <div className="font-semibold text-gray-900">{keug?.bulan_pembayaran || '-'}</div>
                                    </div>
                                </div>
                                <div className="ml-4 text-gray-400">
                                    {expandedDetailCard === keug.id ? '▼' : '▶'}
                                </div>
                            </button>

                            {expandedDetailCard === keug.id && (
                                <div className="border-t border-gray-200 p-4 bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium mb-1">Group POK</p>
                                            <p className="text-sm font-semibold text-gray-900">{keug?.group_pok}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium mb-1">Deskripsi</p>
                                            <p className="text-sm font-semibold text-gray-900">{keug?.deskripsi}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium mb-1">No. Permintaan</p>
                                            <p className="text-sm font-semibold text-gray-900">{keug?.nomor_permintaan}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium mb-1">No. Surat</p>
                                            <p className="text-sm font-semibold text-gray-900">{keug?.nomor_surat}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium mb-1">Tipe Form</p>
                                            <p className="text-sm font-semibold text-gray-900">{keug?.tipe_form}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium mb-1">Jumlah Usulan</p>
                                            <p className="text-sm font-semibold text-gray-900">{keug?.jumlah_usulan}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium mb-1">Dibuat Oleh</p>
                                            <p className="text-sm font-semibold text-gray-900">{keug?.dibuat_oleh}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium mb-1">Link Scan</p>
                                            {keug?.link_scan ? (
                                                <Link to={keug?.link_scan} className='text-blue-600 hover:text-blue-700 font-semibold text-sm'>Lihat</Link>
                                            ) : <span className="text-sm text-gray-500">tidak ada</span>}
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium mb-1">Teknis Kirim ke Umum</p>
                                            <p className="text-sm font-semibold text-gray-900">{keug?.teknis_kirim_ke_umum || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-300 pt-4 mt-4">
                                        <p className="text-sm font-semibold text-gray-900 mb-3">Status Proses:</p>
                                        <div className="flex gap-2 mb-4 flex-wrap">
                                            {hasRole("PPK") && (
                                                <button
                                                    onClick={() => setExpandedRoleTab({ ...expandedRoleTab, [keug.id]: expandedRoleTab[keug.id] === 'PPK' ? '' : 'PPK' })}
                                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${expandedRoleTab[keug.id] === 'PPK' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
                                                >
                                                    PPK
                                                </button>
                                            )}
                                            {hasRole("PPSPM") && (
                                                <button
                                                    onClick={() => setExpandedRoleTab({ ...expandedRoleTab, [keug.id]: expandedRoleTab[keug.id] === 'PPSPM' ? '' : 'PPSPM' })}
                                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${expandedRoleTab[keug.id] === 'PPSPM' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
                                                >
                                                    PPSPM
                                                </button>
                                            )}
                                            {hasRole("Bendahara") && (
                                                <button
                                                    onClick={() => setExpandedRoleTab({ ...expandedRoleTab, [keug.id]: expandedRoleTab[keug.id] === 'Bendahara' ? '' : 'Bendahara' })}
                                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${expandedRoleTab[keug.id] === 'Bendahara' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
                                                >
                                                    Bendahara
                                                </button>
                                            )}
                                            {hasRole("Umum") && (
                                                <button
                                                    onClick={() => setExpandedRoleTab({ ...expandedRoleTab, [keug.id]: expandedRoleTab[keug.id] === 'Umum' ? '' : 'Umum' })}
                                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${expandedRoleTab[keug.id] === 'Umum' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
                                                >
                                                    Umum
                                                </button>
                                            )}
                                        </div>

                                        {expandedRoleTab[keug.id] === 'PPK' && (
                                            <form onSubmit={handleFormUpdate} className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                                                <input type="hidden" name="id" value={keug.id} />
                                                <div>
                                                    <label className='text-xs font-semibold text-gray-900 block mb-1'>PPPK Cek Dokumen</label>
                                                    <input type="text" name="ppk_cek_dokumen" disabled={!hasRole("PPK")} value={updateData?.ppk_cek_dokumen || keug.ppk_cek_dokumen || ""} onChange={(e) => handleChangeUpdate(e, keug.id)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100" />
                                                </div>
                                                <div>
                                                    <label className='text-xs font-semibold text-gray-900 block mb-1'>Kirim ke PPSPM</label>
                                                    <input type="datetime-local" name="ppk_kirim_ke_ppspm" disabled={!hasRole("PPK")} value={formatDateForInput(updateData?.ppk_kirim_ke_ppspm || keug.ppk_kirim_ke_ppspm)} onChange={(e) => handleChangeUpdate(e, keug.id)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100" />
                                                </div>
                                                {hasRole("PPK") && <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm transition-colors">Simpan</button>}
                                            </form>
                                        )}

                                        {expandedRoleTab[keug.id] === 'PPSPM' && (
                                            <form onSubmit={handleFormUpdate} className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                                                <input type="hidden" name="id" value={keug.id} />
                                                <div>
                                                    <label className='text-xs font-semibold text-gray-900 block mb-1'>PPSPM Cek Dokumen</label>
                                                    <input type="text" name="ppspm_cek_dokumen" disabled={!hasRole("PPSPM")} value={updateData?.ppspm_cek_dokumen || keug.ppspm_cek_dokumen || ""} onChange={(e) => handleChangeUpdate(e, keug.id)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100" />
                                                </div>
                                                <div>
                                                    <label className='text-xs font-semibold text-gray-900 block mb-1'>Kirim ke Bendahara</label>
                                                    <input type="datetime-local" name="ppspm_kirim_ke_bendahara" disabled={!hasRole("PPSPM")} value={formatDateForInput(updateData?.ppspm_kirim_ke_bendahara || keug.ppspm_kirim_ke_bendahara)} onChange={(e) => handleChangeUpdate(e, keug.id)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100" />
                                                </div>
                                                {hasRole("PPSPM") && <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm transition-colors">Simpan</button>}
                                            </form>
                                        )}

                                        {expandedRoleTab[keug.id] === 'Bendahara' && (
                                            <form onSubmit={handleFormUpdate} className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                                                <input type="hidden" name="id" value={keug.id} />
                                                <div>
                                                    <label className='text-xs font-semibold text-gray-900 block mb-1'>Bendahara Bayar</label>
                                                    <input type="text" name="bendahara_bayar" disabled={!hasRole("Bendahara")} value={updateData?.bendahara_bayar || keug.bendahara_bayar || ""} onChange={(e) => handleChangeUpdate(e, keug.id)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100" />
                                                </div>
                                                <div>
                                                    <label className='text-xs font-semibold text-gray-900 block mb-1'>No SPP</label>
                                                    <input type="text" name="no_spp" disabled={!hasRole("Bendahara")} value={updateData?.no_spp || keug.no_spp || ""} onChange={(e) => handleChangeUpdate(e, keug.id)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100" />
                                                </div>
                                                <div>
                                                    <label className='text-xs font-semibold text-gray-900 block mb-1'>Tanggal SPP</label>
                                                    <input type="datetime-local" name="tanggal_spp" disabled={!hasRole("Bendahara")} value={formatDateForInput(updateData?.tanggal_spp || keug.tanggal_spp)} onChange={(e) => handleChangeUpdate(e, keug.id)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100" />
                                                </div>
                                                {hasRole("Bendahara") && <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm transition-colors">Simpan</button>}
                                            </form>
                                        )}

                                        {expandedRoleTab[keug.id] === 'Umum' && (
                                            <form onSubmit={handleFormUpdate} className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                                                <input type="hidden" name="id" value={keug.id} />
                                                <div>
                                                    <label className='text-xs font-semibold text-gray-900 block mb-1'>Rekap Bos</label>
                                                    <input type="text" name="rekap_bos" disabled={!hasRole("Umum")} value={updateData?.rekap_bos || keug.rekap_bos || ""} onChange={(e) => handleChangeUpdate(e, keug.id)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100" />
                                                </div>
                                                <div>
                                                    <label className='text-xs font-semibold text-gray-900 block mb-1'>Realisasi Bos</label>
                                                    <input type="text" name="realisasi_bos" disabled={!hasRole("Umum")} value={updateData?.realisasi_bos || keug.realisasi_bos || ""} onChange={(e) => handleChangeUpdate(e, keug.id)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100" />
                                                </div>
                                                {hasRole("Umum") && <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm transition-colors">Simpan</button>}
                                            </form>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-300 p-8 text-center text-gray-500">
                    Tidak ada data yang ditemukan.
                </div>
            )}

            <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-lg border border-gray-300">
                <div>
                    <span className="text-sm text-gray-600">
                        Halaman {currentPage} dari {totalPages}
                    </span>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                        &lt;&lt;
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                        &lt;
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                        &gt;
                    </button>
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>
        </div>
    );
}