import React, { useState, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';

interface ModalFormProps {
  onClose: () => void;
  editData: {
    idbarang: string;
    idsupplier: string;
    nama_barang: string;
    penerima: string;
    nama_supplier: string;
    keterangan: string;
    konfir_jumlah: number;
    tanggal: string;
  };
}

interface Supplier {
  idsupplier: string;
  nama_supplier: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};


const ModalForm: React.FC<ModalFormProps> = ({ onClose, editData }) => {
  const [updatedData, setUpdatedData] = useState(editData);
  const [supplier, setSupplier] = useState<Supplier[]>([]);
  const [showModal, setShowModal] = useState(false);

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
    onClose(); // Tutup modal form
  };

  useEffect(() => {
    // Fetch data from the "supplier" table
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3700/supplier');
        const data = await response.json();
        setSupplier(data);
      } catch (error) {
        console.log('Terjadi kesalahan saat mengambil data supplier');
      }
    };

    setTimeout(() => {
      setShowModal(true);
    }, 1); 

    fetchData();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 500); // Mengatur jeda sebelum memanggil onClose()
  };


  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto transition-opacity duration-500 ${
        showModal ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-60">
        <div className="relative bg-white w-1/2 rounded">
        <button
              onClick={handleClose}
              className={`absolute top-0 right-0 p-4 transition-opacity duration-500 ${
                showModal ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <CloseOutlined />
          </button>
          <form onSubmit={handleSubmit}>
            <div className='mt-5 ml-4 p-2 font-semibold text-xl'>
              <h1>EDIT BARANG</h1>
            </div>
            <div className="flex p-2 -mt-3">
              <div className="flex-1">
                <div className="p-4">
                  <div className='font-semibold mb-2'><label htmlFor="nama">Nama Barang</label></div>
                  <input className="w-full p-2 rounded bg-stone-50 border text-gray-600" type="text" id="nama" name="nama" value={updatedData.nama_barang} readOnly />
                </div>
                <div className="p-4 -mt-6">
                  <div className='font-semibold mb-2'><label htmlFor="konfirjumlah">Jumlah</label></div>
                  <input className="w-full p-2 rounded bg-stone-50 border text-gray-600" type="number" id="konfirjumlah" name="konfirjumlah" min="1" value={updatedData.konfir_jumlah} onChange={(e) => setUpdatedData({ ...updatedData, konfir_jumlah: parseInt(e.target.value) })} required readOnly/>
                </div>
                <div className="p-4 -mt-6">
                  <div className='font-semibold mb-2'><label htmlFor="penerima">Penerima</label></div>
                  <input className="w-full p-2 rounded bg-stone-50 border" type="text" id="penerima" name="penerima" value={updatedData.penerima} onChange={(e) => setUpdatedData({ ...updatedData, penerima: e.target.value })} required />
                </div>
                <div className="p-4 -mt-6">
                  <div className='font-semibold mb-2'><label htmlFor="tanggal">Tanggal</label></div>
                  <input className="w-full p-2 rounded bg-stone-50 border text-gray-600" type="datetime-local" id="tanggal" name="tanggal" value={formatDate(updatedData.tanggal)} onChange={(e) => setUpdatedData({ ...updatedData, tanggal: e.target.value })} readOnly/>
                </div>
              </div>
              <div className="flex-1 -ml-4">
                <div className="p-4">
                  <div className='font-semibold mb-2'><label htmlFor="supply">Supplier</label></div>
                  <input className="w-full p-2 rounded bg-stone-50 border text-gray-600" type="text" id="supplier" name="supplier" placeholder="Supplier" value={updatedData.nama_supplier} readOnly />
                </div>
                <div className="p-4 -mt-6 h-3/4" style={{ height: "68%" }}>
                  <div className='font-semibold mb-2'><label htmlFor="keterangan">Keterangan (opsional)</label></div>
                  <textarea className="w-full p-3 rounded bg-stone-50 border" id="keterangan" name="keterangan" placeholder="" style={{ resize: "none", height: "100%" }} value={updatedData.keterangan} onChange={(e) => setUpdatedData({ ...updatedData, keterangan: e.target.value })}></textarea>
                </div>
              </div>
            </div>
            <div className="p-6 text-right -mt-9">
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
