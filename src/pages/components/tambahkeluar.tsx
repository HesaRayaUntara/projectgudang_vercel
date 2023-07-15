import React, { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Select, Space, DatePicker, message } from 'antd';
import moment from 'moment';

interface TambahKeluarModalProps {
  onClose: () => void;
}

const TambahKeluarModal: React.FC<TambahKeluarModalProps> = ({ onClose}) => {
  const [namaBarang, setNamaBarang] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { Option } = Select;


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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleTambahBarang();
  };

  return (
    <div className={`fixed z-10 inset-0 overflow-y-auto transition-opacity duration-500 ${ showModal ? 'opacity-100' : 'opacity-0' }`}>
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="relative bg-white w-1/3 rounded ml-40">
          <button onClick={handleClose} className={`absolute top-0 right-0 p-4 transition-opacity duration-500 ${ showModal ? 'opacity-100' : 'opacity-0' }`}>
              <CloseOutlined />
          </button>
          <form onSubmit={handleSubmit}>
            <div className="mt-5 ml-4 p-2 font-semibold text-xl">
              <h1>TAMBAH BARANG</h1>
            </div>
            <div className='p-2 -mt-4'>
              <div className="p-4">
                <div className='font-semibold mb-2'><label htmlFor="nama">Nama Barang</label></div>
                  <Space wrap>
                    <Select
                      placeholder="Pilih Barang"
                      style={{ width: 380 }}
                      id='nama'
                      value={namaBarang || undefined}
                    >
                         <Option>
                            Rak Besi Susun
                          </Option>
                          <Option>
                            Kebaya Encim
                          </Option>
                          <Option>
                            Kasur Angin Portable
                          </Option>
                          <Option>
                            Batik Bekasi
                          </Option>
                    </Select>
                  </Space>
              </div>
              <div className="p-4 -mt-6">
                <div className='font-semibold mb-2'><label htmlFor="jumlah">Jumlah</label></div>
                <input className="w-full p-2 rounded bg-stone-50 border" type="number" id="jumlah" name="jumlah" min="1" required />
              </div>
              <div className="p-4 -mt-6">
                <div className='font-semibold mb-2'><label htmlFor="penerima">Penerima</label></div>
                <input className="w-full p-2 rounded bg-stone-50 border" type="text" id="penerima" name="penerima" required />
              </div>
            </div>
            <div className="p-6 text-right -mt-9">
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

export default TambahKeluarModal;
