import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import "./dataTable.scss";
import { Link } from "react-router-dom";
import axios from "axios";
// import { useEffect, useState } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

import Swal from 'sweetalert2';
type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
  onEdit: (row: any) => void;
  refreshData: () => Promise<void>;
  endpoint: string;
  tipe_hunian?:string;
  // getRowId?: (row: any) => string | number;
};

const DataTable = (props: Props) => {
  // const [tipeHunian, setTipeHunian] = useState("");
  const token = localStorage.getItem("token");
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    // useEffect(() => {
    //   if (props.tipe_hunian) {
    //     setTipeHunian(props.tipe_hunian);
    //   }
    // }, [props.tipe_hunian]);

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${props.endpoint}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const successMessage =
        props.slug === "IuranBulanan"
          ? "Data sudah dikembalikan menjadi belum bayar."
          : "Data telah dihapus.";

      Swal.fire("Berhasil!", successMessage, "success");
      await props.refreshData(); // jika perlu refresh tabel
    } catch (error) {
      Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
    }

  };



  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
    <div className="action">
      {props.slug !== "IuranBulanan" && (
        <>
          {/* <Link to={`/${props.slug}/${params.row.id}`}>
            <img src="/view.svg" alt="View" />
          </Link> */}
          <div className="edit" onClick={() => props.onEdit(params.row)}>
            <img src="/edit.svg" alt="Edit" />
          </div>
        </>
      )}
      
      <div
        className="delete"
        onClick={() => {
          if (props.slug === "KelolaPenghuni") {
            handleDelete(params.row.house_resident_id);
          } else if (props.slug === "IuranBulanan") {
            handleDelete(params.row.contribution_monthly_id);
          } else {
            handleDelete(params.row.id);
          }
        }}
      >
        <img src="/delete.svg" alt="Delete" />
      </div>
    </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        // {...(props.getRowId ? { getRowId: props.getRowId } : {})}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default DataTable;
