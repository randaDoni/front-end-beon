import { useEffect, useState } from "react";
import "./rumah.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";



const Rumah = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>(null);
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "alamat",
      type: "string",
      headerName: "Alamat",
      width: 350,
    },
    {
      field: "resident_status",
      headerName: "Status Penghuni",
      width: 150,
      renderCell: (params) => (
        <span style={{
          padding: "4px 8px",
          borderRadius: "8px",
          backgroundColor: params.value === "dihuni" ? "#d4edda" : "#fff3cd", // hijau muda vs kuning muda
          color: params.value === "dihuni" ? "#155724" : "#856404",           // hijau tua vs kuning tua
          fontWeight: 600,
        }}  
      >
        {params.value}
      </span>
      )

    },
  ];

  const handleEdit = (data:any) => {
    setEditData(data);
    setOpen(true);
  }
  
  const fetchHouse = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/houses", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setRows(response.data);
    } catch (err: any) {
      setError("Gagal memuat data rumah");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchHouse();
  }, []);

  return (
    <div className="rumah">
      <div className="info">
        <h1>Rumah</h1>
        <button onClick={() => {setOpen(true); setEditData(null);}}>Tambahkan Rumah</button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error? (
        <p style={{color: "red"}}>{error}</p>
      ) : (
        <DataTable slug="rumah" columns={columns} rows={rows} refreshData={fetchHouse} endpoint="http://localhost:8000/api/houses/" onEdit={(row)=> {
          setEditData (row);
          setOpen(true);
        }} />
      )}

      {open && (
        <Add slug="house" columns={columns} setOpen={setOpen}  endpoint="http://localhost:8000/api/houses"
        editData={editData}
        refreshData={fetchHouse}
        />
      )}
      
      
    </div>
  );
};

export default Rumah;
