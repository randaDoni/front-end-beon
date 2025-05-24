import { useEffect, useState } from "react";
import "./masterDataAccidential.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";



const MasterDataAccidential = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>(null);
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      type: "string",
      headerName: "Nama Pembayaran",
      width: 350,
    },    
    {
      field: "price",
      type: "string",
      headerName: "Harga",
      width: 350,
    },
  ];

  const handleEdit = (data:any) => {
    setEditData(data);
    setOpen(true);
  }
  
  const fetchHouse = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/accidential_data_monthly_payment", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setRows(response.data);
    } catch (err: any) {
      setError("Gagal memuat data MasterDataAccidential");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchHouse();
  }, []);

  return (
    <div className="MasterDataAccidential">
      <div className="info">
        <h1>MasterDataAccidential</h1>
        <button onClick={() => {setOpen(true); setEditData(null);}}>Tambahkan Master Data Monthly</button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error? (
        <p style={{color: "red"}}>{error}</p>
      ) : (
        <DataTable slug="MasterDataAccidential" columns={columns} rows={rows} refreshData={fetchHouse} endpoint="http://localhost:8000/api/accidential_data_monthly_payment/" onEdit={(row)=> {
          setEditData (row);
          setOpen(true);
        }} />
      )}

      {open && (
        <Add slug="MasterDataAccidential" columns={columns} setOpen={setOpen}  endpoint="http://localhost:8000/api/accidential_data_monthly_payment"
        editData={editData}
        refreshData={fetchHouse}
        />
      )}
      
      
    </div>
  );
};

export default MasterDataAccidential;
