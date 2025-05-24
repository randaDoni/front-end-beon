import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./penghuni.scss";
import { useEffect, useState } from "react";
import Add from "../../components/add/Add";
import axios from "axios";

const Penghuni = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const handleOpenModal = (ktpPath: string) => {
    setModalImage(`http://localhost:8000/storage/${ktpPath}`);
  };

  const handleCloseModal = () => {
    setModalImage(null);
  };

  const handleEdit = (data: any) => {
    setEditData(data);
    setOpen(true);
  };

  const fetchResidents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/residents", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setRows(response.data);
    } catch (err: any) {
      setError("Gagal memuat data penghuni");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);


  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", type: "string", headerName: "Name", width: 150 },
    { field: "telp_number", type: "string", headerName: "Phone", width: 150 },
    {
      field: "married_status",
      headerName: "Married Status",
      width: 150,
      renderCell: (params) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "8px",
            backgroundColor: params.value === "sudah" ? "#d4edda" : "#f8d7da",
            color: params.value === "sudah" ? "#155724" : "#721c24",
            fontWeight: 600,
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "contract_status",
      headerName: "Contract Status",
      width: 150,
    },
    {
      field: "ktp",
      headerName: "KTP",
      width: 100,
      renderCell: (params) => (
        <button onClick={() => handleOpenModal(params.row.ktp)}>Lihat</button>
      ),
    },
    // {
    //   field: "action",
    //   headerName: "Aksi",
    //   width: 100,
    //   renderCell: (params) => (
    //     <button onClick={() => handleEdit(params.row)}>Edit</button>
    //   ),
    // },
  ];

  return (
    <div className="penghuni">
      <div className="info">
        <h1>Penghuni</h1>
        <button onClick={() => { setOpen(true); setEditData(null); }}>
          Tambahkan Penghuni
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <DataTable slug="Penghuni" columns={columns} rows={rows} refreshData={fetchResidents} endpoint="http://localhost:8000/api/residents/" onEdit={(row) => {
          setEditData(row);
          setOpen(true);
          
        }} />
      )}

      {modalImage && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImage} alt="KTP" />
            <button onClick={handleCloseModal}>Tutup</button>
          </div>
        </div>
      )}

      {open && (
        <Add
          slug="user"
          columns={columns}
          setOpen={setOpen}
          editData={editData}
          refreshData={fetchResidents}
          endpoint="http://localhost:8000/api/residents"
        />
      )}
    </div>
  );
};

export default Penghuni;
