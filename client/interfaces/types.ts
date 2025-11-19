export interface User {
  id: number;
  namaLengkap: string;
  posisi: string;
  statusSeleksi: string;
  posisiDaftar: string;
  alamatDetail: string;
  alamatProv: number;
  alamatKab: number;
  alamatKec: number;
  alamatDesa: number;
  tempatTanggalLahir: string;
  jenisKelamin: string;
  pendidikan: string;
  pekerjaan: string;
  deskripsiPekerjaan: string | null;
  noTelp: string;
  sobatId: string;
  email: string;
}

export interface UserResponse {
  status_code: number;
  message: string;
  data: User[];
}

export interface PenilaianMitra {
  id: string;
  namaLengkap: string;
  posisi: string;
}

export interface BatasHonor{
  id: number,
  nama_posisi: string,
  biaya: string,
  keterangan: string,
  flag: string
}

export interface BatasHonorResponse {
  status_code: string;
  message: string;
  data: BatasHonor[];
}

export interface Kegiatan{
  bulan    :   string,
  tanggal   :  string,
  tim        : string,
  nama_survei : string,
  nama_survei_sobat : string,
  kegiatan   : string,
  tahun : number,
}

export interface KegiatanMitra {
  id: number;
  bulan: string;
  tanggal: string;
  tim: string;
  nama_survei: string;
  nama_survei_sobat: string;
  kegiatan: string;
  tahun: number;
  pcl_pml_olah: string;
  nama_petugas: string;
  id_sobat: string;
  satuan: string;
  volum: number;
  harga_per_satuan: number;
  jumlah: number; 
  konfirmasi: string;
  flag_sobat: string;
  kegiatanId: string;
}

export interface KegiatanMitraResponse{
  id: number;
  bulan: string;
  tanggal: string;
  tim: string;
  nama_survei: string;
  nama_survei_sobat: string;
  kegiatan: string;
  tahun: number;
  mitra : KegiatanMitra[]
}

export interface KegiatanMitraRequest{
  
  volum: number,
  harga_per_satuan: number,
  id_sobat: string,
  pcl_pml_olah: string,
  satuan: string,
  kegiatanId: string,
  jumlah: number,
}

export interface MatriksKegiatan{
  bulan: string,
  kegiatan: string[]
}

export interface File{
  file : FormData
}

export interface KeuanganForm {
  id: number,
  tim: string;
  bulan_kegiatan: string;
  group_pok: string;
  detail: string;
  nomor_permintaan: number;
  deskripsi: string;
  nomor_surat: string;
  tipe_form: string;
  dibuat_oleh: string;
  jumlah_usulan: number;
  link_scan: string;
  bulan_pembayaran: string;
   teknis_kirim_ke_umum: string | null; 
}

export interface KeuanganUpdateBendahara {
    bendahara_bayar    :   string;
    no_spp  :   string;
    tanggal_spp :        string | null;
}

export interface KeuanganUpdatePPK {
    ppk_cek_dokumen    :   string;
    ppk_kirim_ke_ppspm  :   string;
}

export interface KeuanganUpdatePPSPM {
  ppspm_cek_dokumen    :   string;
  ppspm_kirim_ke_bendahara  :  string | null;
}

export interface KeuanganUpdateUmum{
  rekap_bos  :   string;
  realisasi_bos :        string;
}