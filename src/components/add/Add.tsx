import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editData?: any;
  refreshData: () => void;
  endpoint: string;
};

const Add = ({ slug, columns, setOpen, editData, refreshData, endpoint }: Props) => {
  const [formData, setFormData] = useState<any>({});
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [residents, setResidents] = useState([]);
  const [address, setAddress] = useState([]);
  const [tipeHunian, setTipeHunian] = useState("");

  const fetchResidents = async (status: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/residents/ResidentName?status=${status.toLowerCase()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResidents(response.data.data);
    } catch (error) {
      console.error("Gagal memuat data residents:", error);
    }
  };

  const fetchAddress = async (status: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/houses/AddressName?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddress(response.data.data);
    } catch (error) {
      console.error("Gagal memuat data alamat:", error);
    }
  };

  // === useEffect utama saat editData ada atau tidak ===
  useEffect(() => {
    if (slug === "KelolaPenghuni") {
      if (editData) {
        const tipe = editData.tipe_hunian || "";
        setFormData({
          ...editData,
          house_id: editData.house_id || editData.id || "", // fallback prioritaskan house_id
        });
        setTipeHunian(tipe);

        if (tipe) {
          fetchResidents(tipe);
          const status = tipe === "Tetap" ? "dihuni" : "tidak dihuni";
          fetchAddress(status);
        }
      } else {
        setFormData({});
        setTipeHunian("");
      }
    } else {
      if (editData) {
        setFormData({ ...editData });
      } else {
        setFormData({});
      }
    }
  }, [editData, slug]);

  // === useEffect tambahan untuk fetch data saat tipeHunian dipilih manual ===
  useEffect(() => {
    if (slug === "KelolaPenghuni" && tipeHunian && !editData) {
      fetchResidents(tipeHunian);
      const status = tipeHunian === "Tetap" ? "dihuni" : "tidak dihuni";
      fetchAddress(status);
    }
  }, [tipeHunian, slug, editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log (name, value);
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setKtpFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (slug === "KelolaPenghuni") {
      formData.tipe_hunian = tipeHunian;
    }
    if (slug === "KelolaPenghuni" && editData) {
      formData.tipe_hunian = tipeHunian;
      formData.house_id = editData.id;
      formData.house_resident_id = editData.house_resident_id;
    }

    const token = localStorage.getItem("token");
    const payload = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "ktp") {
        payload.append(key, formData[key]);
      }
    });

    if (ktpFile) {
      payload.append("ktp", ktpFile);
    }

    try {
      if (editData) {
        payload.append("_method", "PUT");
        await axios.post(`${endpoint}/${editData.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(endpoint, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      Swal.fire("Berhasil!", "Aksi anda berhasil", "success");
      await refreshData();
      setOpen(false);
    } catch (error: any) {
      console.error("Gagal menyimpan:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
    }
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => setOpen(false)}>X</span>
        <h1>{editData ? "Edit" : "Tambah"} {slug}</h1>
        <form onSubmit={handleSubmit}>
          {slug === "KelolaPenghuni" && !editData && (
            <div className="item">
              <label>Tipe Hunian</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="tipe_hunian"
                    value="Tetap"
                    checked={tipeHunian === "Tetap"}
                    onChange={(e) => setTipeHunian(e.target.value)}
                  />
                  Tetap
                </label>
                <label>
                  <input
                    type="radio"
                    name="tipe_hunian"
                    value="Kontrak"
                    checked={tipeHunian === "Kontrak"}
                    onChange={(e) => setTipeHunian(e.target.value)}
                  />
                  Kontrak
                </label>
              </div>
            </div>
          )}
          {columns
            .filter((item) => {
              if (item.field === "id" || item.field === "action") return false;
              if (slug === "KelolaPenghuni" && editData) {
                return ["resident_name", "date_of_entry", "exit_date"].includes(item.field);
              }
              return true;
            })
            .map((column) => (
              <div className="item" key={column.field}>
                {!(slug === "KelolaPenghuni" && column.headerName === "Tipe Hunian" && editData) && (
                  <label>{column.headerName}</label>
                )}
                {column.field === "married_status" ? (
                  <select name="married_status" value={formData.married_status || ""} onChange={handleChange}>
                    <option value="">Pilih Status</option>
                    <option value="sudah">Sudah</option>
                    <option value="belum">Belum</option>
                  </select>
                ) : slug === "MasterDataAccidential" && column.field === "bulan" ? (
                  <select name="bulan" value={formData.bulan || ""} onChange={handleChange}>
                    <option value="">Pilih Bulan</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                ) : column.field === "contract_status" ? (
                  <select name="contract_status" value={formData.contract_status || ""} onChange={handleChange}>
                    <option value="">Pilih Status</option>
                    <option value="kontrak">Kontrak</option>
                    <option value="tetap">Tetap</option>
                  </select>
                ) : column.field === "ktp" ? (
                  <input type="file" name="ktp" accept="image/*" onChange={handleFileChange} />
                ) : column.field === "resident_status" ? (
                  <select name="resident_status" value={formData.resident_status || ""} onChange={handleChange}>
                    <option value="">Pilih Status</option>
                    <option value="dihuni">dihuni</option>
                    <option value="tidak dihuni">tidak dihuni</option>
                  </select>
                ) : column.field === "alamat" && slug === "KelolaPenghuni" ? (
                  <select name="house_id" value={formData.house_id || ""} onChange={handleChange}>
                    <option value="">Pilih Alamat</option>
                    {address.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.alamat}
                      </option>
                    ))}
                  </select>
                ) : column.field === "date_of_entry" ? (
                  <input
                    type="date"
                    name="date_of_entry"
                    value={formData.date_of_entry || ""}
                    onChange={handleChange}
                    readOnly={tipeHunian === "Tetap"}
                  />
                ) : column.field === "exit_date" ? (
                  <input
                    type="date"
                    name="exit_date"
                    value={formData.exit_date || ""}
                    onChange={handleChange}
                    readOnly={tipeHunian === "Tetap"}
                  />
                ) : column.field === "resident_name" && slug === "KelolaPenghuni" ? (
                  <select name="resident_id" value={formData.resident_id || ""} onChange={handleChange}>
                    <option value="">Pilih Penghuni</option>
                    {residents.map((resident: any) => (
                      <option key={resident.id} value={resident.id}>
                        {resident.name}
                      </option>
                    ))}
                  </select>
                ) : column.field === "tipe_hunian" ? (
                  <select name="resident_status" value={formData.resident_status || ""} onChange={handleChange} hidden>
                    <option value="">Pilih Tipe</option>
                    <option value="dihuni">Kontrak</option>
                    <option value="tidak dihuni">Tetap</option>
                  </select>
                ) : (
                  <input
                    type={column.type}
                    name={column.field}
                    value={formData[column.field] || ""}
                    placeholder={column.headerName}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
          <button type="submit">{editData ? "Update" : "Send"}</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
