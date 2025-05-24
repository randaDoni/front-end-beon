import { useEffect, useState } from "react";
import "./IuranBulanan.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i); // tahun -5 s.d +4


const IuranBulanan = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const columns: GridColDef[] = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "alamat",
      headerName: "Alamat",
      width: 250,
    },
    {
      field: "resident_name",
      type: "string",
      headerName: "Nama Penghuni",
      width: 250,
      renderCell: (params) => (
        params.value ? params.value : <span style={{ color: "#888" }}>-</span>
      ),
    },
    {
      field: "pay_this_month",
      headerName: "Membayar Bulanan Ini",
      width: 150,
      renderCell: (params) => {
        const value = params.value;
        const isEmpty = !value || value.toString().trim() === "";

        const backgroundColor = isEmpty
          ? "#00000000" // transparan atau bisa kamu kasih warna netral kalau mau
          : value === "Sudah"
          ? "#d4edda" // hijau muda
          : "#fff3cd"; // kuning muda

        const color = isEmpty
          ? "#000000" // hitam
          : value === "Belum"
          ? "#155724" // hijau tua
          : "#856404"; // kuning tua

        return (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "8px",
              backgroundColor,
              color,
              fontWeight: 600,
            }}
          >
            {isEmpty ? "Belum" : value}
          </span>
        );
      },
    },  

  ];

  const handleEdit = (data:any) => {
    setEditData(data);
    setOpen(true);
  }
  
  const fetchHouse = async () => {
    if (!selectedMonth || !selectedYear) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/accidential_data_monthly_payment", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params: {
          bulan: selectedMonth,
          tahun: selectedYear,
        },
      });

      setRows(response.data);
    } catch (err: any) {
      setError("Gagal memuat data IuranBulanan");
    } finally {
      setIsLoading(false);
    }
  }



  return (
    <div className="IuranBulanan">
      <div className="info">
        <h1>IuranBulanan</h1>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="">Pilih Bulan</option>
            {months.map((month, idx) => (
              <option key={idx} value={month}>{month}</option>
            ))}
          </select>

          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="">Pilih Tahun</option>
            {years.map((year, idx) => (
              <option key={idx} value={year.toString()}>{year}</option>
            ))}
          </select>

          <button disabled={!selectedMonth || !selectedYear} onClick={fetchHouse}>
            Tampilkan Data
          </button>
        </div>

        <button onClick={() => {setOpen(true); setEditData(null);}}>Tambahkan IuranBulanan</button>
      </div>

      {isLoading ? (
        <p>Pilih Bulan Terlebih Dahulu</p>
      ) : error? (
        <p style={{color: "red"}}>{error}</p>
      ) : (
        <DataTable slug="IuranBulanan"  columns={columns} rows={rows} refreshData={fetchHouse} endpoint="http://localhost:8000/api/accidential_data_monthly_payment/" onEdit={(row)=> {
          setEditData (row);
          setOpen(true);
        }} />
      )}

      {open && (
        <Add slug="IuranBulanan"  columns={columns} setOpen={setOpen}  endpoint="http://localhost:8000/api/accidential_data_monthly_payment"
        editData={editData}
        refreshData={fetchHouse}
        />
      )}
      
      
    </div>
  );
};

export default IuranBulanan;
