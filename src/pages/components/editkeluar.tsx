import React, { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';

interface ModalFormProps {
  onClose: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ onClose }) => {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      try {
        const response = {}

        if (response) {
          alert('Data berhasil diubah');
          window.location.reload();
        } else {
          alert('Data gagal diubah');
        }
      } catch (error) {
        alert('Terjadi kesalahan saat mengubah data');
      }
    }

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
    <div className={`fixed z-10 inset-0 overflow-y-auto transition-opacity duration-500 ${ showModal ? 'opacity-100' : 'opacity-0' }`}>
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="relative bg-white w-1/3 rounded ml-40">
          <button onClick={handleClose} className={`absolute top-0 right-0 p-4 transition-opacity duration-500 ${ showModal ? 'opacity-100' : 'opacity-0' }`}>
            <CloseOutlined />
          </button>
          <form onSubmit={handleSubmit}>
            <div className="mt-4 ml-4 p-2 font-semibold text-xl">
              <h1>EDIT BARANG</h1>
            </div>
            <div className='p-2 -mt-4'>
              <div className="p-4">
                <div className='font-semibold mb-2'><label htmlFor="nama">Nama Barang</label></div>
                <input className='w-full p-2 rounded bg-stone-50 border text-gray-600' type="text" id="nama" name="nama" placeholder='Nama Barang' readOnly />
              </div>
              <div className="p-4 -mt-6">
                <div className='font-semibold mb-2'><label htmlFor="penerima">Penerima</label></div>
                <input className="w-full p-2 rounded bg-stone-50 border" type="text" id="penerima" name="penerima" placeholder='Penerima' required />
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
