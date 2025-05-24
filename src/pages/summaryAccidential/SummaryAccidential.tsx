// components/summaryAccidential.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./summaryAccidential.scss";

const SummaryAccidential = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (selectedYear: number) => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/contribution_accidential/summary?tahun=${selectedYear}`,{
            headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setData(res.data);
    } catch (error) {
      console.error("Gagal fetch data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(year);
  }, [year]);

  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="p-6">
      <div className="mb-4">
        <label htmlFor="year" className="font-semibold mr-2">Pilih Tahun:</label>
        <select
          id="year"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="border px-3 py-1 rounded"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Memuat grafik...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500 italic">Tidak ada data untuk tahun {year}.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bulan" />
            <YAxis />
            <Tooltip formatter={(val: number) => `Rp ${val.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="pemasukan" fill="#4ade80" name="Pemasukan" />
            <Bar dataKey="pengeluaran" fill="#f87171" name="Pengeluaran" />
            <Bar dataKey="saldo" fill="#60a5fa" name="Saldo" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SummaryAccidential;
