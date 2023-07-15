import React, { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';

interface ModalFormProps {
  onClose: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ onClose }) => {
  const [namaSupplier, setNamaSupplier] = useState('');
  const [alamat, setAlamat] = useState('');
  const [telepon, setTelepon] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const handleTambahBarang = async () => {
    try {

      const response = {}

      if (response) {
        alert('Data berhasil ditambah');
        onClose();
        window.location.reload();
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menambah data');
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    handleTambahBarang();
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
    }, 500); // Mengatur jeda sebelum memanggil onClose()
  };
  

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto transition-opacity duration-500 ${
        showModal ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="relative bg-white w-1/3 rounded ml-40">
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
              <h1>TAMBAH SUPPLIER</h1>
            </div>
            <div className="p-4">
              <div className='font-semibold mb-2'><label htmlFor="nama">Nama Supplier</label></div>
              <input className='w-full p-2 rounded bg-stone-50 border' type="text" id="nama" name="nama" required/>
            </div>
            <div className="p-4 -mt-6">
              <div className='font-semibold mb-2'><label htmlFor="alamat">Alamat</label></div>
              <input className='w-full p-2 rounded bg-stone-50 border' type="text" id="alamat" name="alamat" required/>
            </div>
            <div className="p-4 -mt-6">
              <div className='font-semibold mb-2'><label htmlFor="telepon">Telepon</label></div>
              <input className='w-full p-2 rounded bg-stone-50 border' type="text" id="telepon" name="telepon" maxLength={15} required/>
            </div>
              <div className="p-4 text-right -mt-5">
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
