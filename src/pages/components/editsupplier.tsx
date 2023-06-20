import React, { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';

interface ModalFormProps {
  onClose: () => void;
  editData: {
    idsupplier: string;
    nama_supplier: string;
    alamat: string;
    telepon: string;
  };
}

const ModalForm: React.FC<ModalFormProps> = ({ onClose, editData }) => {
  const [updatedData, setUpdatedData] = useState(editData); // Mengubah inisialisasi state
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editData.idsupplier) {
      try {
        const response = await fetch(`http://localhost:3700/supplier/${editData.idsupplier}`, {
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

  useEffect(() => {

    setTimeout(() => {
      setShowModal(true);
    }, 1);
  
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 500);
  };


  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto transition-opacity duration-500 ${
        showModal ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-60">
        <div className="relative bg-white w-1/3 rounded">
            <button
              onClick={handleClose}
              className={`absolute top-0 right-0 p-4 transition-opacity duration-500 ${
                showModal ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <CloseOutlined />
          </button>
          <form onSubmit={handleSubmit}>
            <div className='mt-5 ml-4 font-semibold text-xl'>
              <h1>EDIT SUPPLIER</h1>
            </div>
            <div className="p-4">
              <div className='font-semibold mb-2'><label htmlFor="nama">Nama Supplier</label></div>
              <input className='w-full p-2 rounded bg-stone-50 border text-gray-600' type="text" id="nama" name="nama" placeholder='Nama Barang' value={updatedData.nama_supplier} readOnly required onChange={(e) => setUpdatedData({ ...updatedData, nama_supplier: e.target.value })}/>
            </div>
            <div className="p-4 -mt-6">
              <div className='font-semibold mb-2'><label htmlFor="alamat">Alamat</label></div>
              <input className='w-full p-2 rounded bg-stone-50 border' type="text" id="alamat" name="alamat" placeholder='alamat' value={updatedData.alamat} required onChange={(e) => setUpdatedData({ ...updatedData, alamat: e.target.value })}/>
            </div>
            <div className="p-4 -mt-6">
              <div className='font-semibold mb-2'><label htmlFor="telepon">Telepon</label></div>
              <input className='w-full p-2 rounded bg-stone-50 border' type="number" id="telepon"name="telepon" placeholder='Telepon' value={updatedData.telepon} required onChange={(e) => setUpdatedData({ ...updatedData, telepon: e.target.value })}/>
            </div>
            <div className="p-4 text-right -mt-5">
              <button type="submit" className="bg-green-500 text-white p-2 px-4 rounded hover:bg-green-600">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
