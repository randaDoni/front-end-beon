import { useEffect, useState } from "react";
import "./iuranAccidential.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import Swal from "sweetalert2";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

const IuranAccidential = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [houses, setHouses] = useState<any[]>([]);
  const [paymentType, setPaymentType] = useState("Bulanan");
  const [selectedHouse, setSelectedHouse] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState("");

  const columns: GridColDef[] = [
    {
      field: "alamat",
      headerName: "Alamat",
      width: 250,
    },
    {
      field: "resident_name",
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
          ? "#00000000"
          : value === "Sudah"
            ? "#d4edda"
            : "#fff3cd";

        const color = isEmpty
          ? "#000000"
          : value === "Belum"
            ? "#155724"
            : "#856404";

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
    {
      field: "item_name",
      headerName: "Item Yang Dibayar",
      width: 250,
      renderCell: (params) => (
        params.value ? params.value : <span style={{ color: "#888" }}>-</span>
      ),
    },
  ];

  const fetchHouse = async () => {
    if (!selectedMonth || !selectedYear) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/contribution_accidential", {
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
      setError("Gagal memuat data IuranAccidential");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHouseAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/contribution_accidential", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params: {
          bulan: selectedMonth,
          tahun: selectedYear,
        },
      });
      const houseData = res.data.map((row: any) => ({
        id: row.id,
        alamat: row.alamat,
      }));
      setHouses(houseData);
    } catch (err) {
      console.error("Gagal mengambil data alamat rumah");
    }
  };

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/contribution_accidential/Item", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },params: {
          bulan: selectedMonth,
          tahun: selectedYear,
        },
      });
      const items = res.data.map((row: any) => ({
        id: row.id,
        name: row.name,
      }));
      setItems(items);
    } catch (err) {
      console.error("Gagal mengambil data item");
    }
  };

  useEffect(() => {
    if (showPaymentForm && selectedMonth && selectedYear) {
      fetchHouseAddresses();
      fetchItems();
    }
  }, [showPaymentForm, selectedMonth, selectedYear]);

  const handlePaymentSubmit = async () => {
    if (!selectedHouse || !selectedItem || !selectedMonth || !selectedYear) {
      Swal.fire({
        icon: 'warning',
        title: 'Lengkapi Isian',
        text: 'Mohon lengkapi semua isian sebelum melakukan pembayaran.',
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/contribution_accidential/payment",
        {
          bulan: selectedMonth,
          tahun: selectedYear,
          house_id: selectedHouse,
          item_id: selectedItem,
          // tipe_pembayaran: paymentType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      Swal.fire({
        icon: 'success',
        title: 'Pembayaran Selesai',
        text: 'Pembayaran selesai.',
      });
      setShowPaymentForm(false);
      fetchHouse();
    } catch (err: any) {
      console.error(err);
            Swal.fire({
        icon: 'warning',
        title: 'Lengkapi Isian',
        text: 'Mohon lengkapi semua isian sebelum melakukan pembayaran.',
      });;
    }
  };

  return (
    <div className="IuranAccidential">
      <div className="info">
        <h1>Iuran Bulanan Ndadak</h1>
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

        <div style={{ display: "flex", gap: "1rem" }}>
          <button disabled={!selectedMonth || !selectedYear} onClick={() => setShowPaymentForm(true)}>
            Bayar Iuran
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Pilih Bulan Terlebih Dahulu</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <DataTable
          slug="IuranBulanan"
          columns={columns}
          rows={rows}
          refreshData={fetchHouse}
          endpoint="http://localhost:8000/api/contribution_accidential/"
          onEdit={(row) => {
            setEditData(row);
            setOpen(true);
          }}
        />
      )}

      {open && (
        <Add
          slug="IuranBulanan"
          columns={columns}
          setOpen={setOpen}
          endpoint="http://localhost:8000/api/contribution_accidential/"
          editData={editData}
          refreshData={fetchHouse}
        />
      )}

      {showPaymentForm && (
        <div className="payment-form">
          <h3>Form Pembayaran</h3>

          {/* <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
            <option value="bulanan">Bulanan</option>
            <option value="tahunan">Tahunan</option>
          </select> */}

          <select value={selectedHouse} onChange={(e) => setSelectedHouse(e.target.value)}>
            <option value="">Pilih Alamat</option>
            {houses.map((house) => (
              <option key={house.id} value={house.id}>{house.alamat}</option>
            ))}
          </select>

          <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
            <option value="">Pilih Item yang Dibayar</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>

          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={handlePaymentSubmit}
              disabled={!selectedHouse || !selectedItem || !selectedMonth || !selectedYear}
            >
              Kirim Pembayaran
            </button>
            <button onClick={() => setShowPaymentForm(false)} style={{ marginLeft: "1rem" }}>Batal</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IuranAccidential;
