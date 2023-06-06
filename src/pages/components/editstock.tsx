import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';

interface ModalFormProps {
  onClose: () => void;
  editData: {
    idbarang: string;
    nama_barang: string;
    keterangan: string;
  };
}

const ModalForm: React.FC<ModalFormProps> = ({ onClose, editData }) => {
  const [updatedData, setUpdatedData] = useState(editData);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editData.idbarang) {
      try {
        const response = await fetch(`http://localhost:3700/masuk/${editData.idbarang}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          alert('Data berhasil diubah');
          window.location.reload();
        } else {
          alert('Data gagal diubah');
        }
      } catch (error) {
        alert('Terjadi kesalahan saat mengubah data');
      }
    }
    onClose();
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-60">
        <div className="relative bg-white w-1/3 rounded">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button onClick={onClose}><CloseOutlined /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className='mt-5 ml-5 font-semibold text-xl'>
              <h1>EDIT BARANG</h1>
            </div>
            <div className="p-4">
              <input
                className='w-full p-2 rounded bg-slate-100 text-gray-400'
                type="text"
                id="nama"
                name="nama"
                placeholder='Nama Barang'
                value={updatedData.nama_barang}
                readOnly
                required
                onChange={(e) => setUpdatedData({ ...updatedData, nama_barang: e.target.value })}
              />
            </div>
            <div className="p-4 -mt-4">
              <input
                className='w-full p-2 rounded bg-slate-100'
                type="text" // Ubah tipe input menjadi "text"
                id="keterangan"
                name="keterangan"
                placeholder='Keterangan'
                value={updatedData.keterangan}
                required
                onChange={(e) => setUpdatedData({ ...updatedData, keterangan: e.target.value })} // Perbaiki penulisan "deskrispi" menjadi "deskripsi"
              />
            </div>
            <div className="p-4">
              <button type="submit" className="bg-blue-500 text-white p-2 px-4 rounded hover:bg-blue-600">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
