import React, { useEffect, useState } from 'react';
import {
  LogoutOutlined,
  BlockOutlined,
  AppstoreOutlined,
  DeploymentUnitOutlined,
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined,
  HomeOutlined,
  FileAddOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { MenuProps, Modal, message } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import router, { useRouter } from 'next/router';
import TambahKeluarModal from '@/pages/components/tambahkeluar';
import EditKeluarModal from '@/pages/components/editkeluar';
import moment from 'moment';
import 'moment-timezone';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  href?: string,
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick: () => {
      if (href) {
        router.push(href);
      }
    },
    ...(href ? { itemRender: () => <Link href={href}>{label}</Link> } : {}),
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', '1', <HomeOutlined />, undefined, '/'),
  getItem('Stock Barang', '2', <AppstoreOutlined />, undefined, '/stock'),
  getItem('Barang Masuk', '3', <FileAddOutlined />, undefined, '/masuk'),
  getItem('Barang Keluar', '4', <ExportOutlined />, undefined, '/keluar'),
  getItem('Supplier', '5', <DeploymentUnitOutlined />, undefined, '/supplier'),
  getItem('Logout', '6', <LogoutOutlined />, undefined, '/login'),
];

type DataKeluar = {
  idkeluar: string;
  idbarang: string;
  tanggal: string;
  nama_barang: string;
  jumlah: number;
  penerima: string;
};

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dataKeluar, setDataKeluar] = useState<DataKeluar[]>([]);
  const [editData, setEditData] = useState<DataKeluar>({ idbarang: '', idkeluar: '', tanggal: '', nama_barang: '', penerima: '', jumlah: 0});
  const [isTableEmpty, setIsTableEmpty] = useState(true);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();

  const handleOpenTambahModal = () => {
    setShowTambahModal(true);
  };

  const handleCloseTambahModal = () => {
    setShowTambahModal(false);
  };

  const handleOpenEditModal = (data: DataKeluar) => {
    setEditData(data);
    setShowEditModal(true);
  };
  

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  interface ModalFormProps {
    onClose: () => void;
    editData: DataKeluar; // Menghapus 'Partial'
  }


  const handlePrintPDF = () => {
    const doc = new jsPDF();
  
    // Membuat judul halaman
    doc.text('Data Barang Keluar', 14, 20);
  
    // Membuat array untuk menyimpan data tabel
    const tableData = [];
  
    // Menambahkan header tabel
    const headers = ['No.', 'Nama Barang', 'Tanggal', 'Jumlah', 'Penerima'];
    tableData.push(headers);
  
    // Menambahkan data dari state dataMasuk ke dalam array tabel
    dataKeluar.forEach((item, index) => {
      const rowData = [index + 1, item.nama_barang, item.tanggal, item.jumlah, item.penerima];
      tableData.push(rowData);
    });
  
    // Mencetak tabel menggunakan autoTable
    doc.autoTable({
      head: [tableData[0]], // Menggunakan array di dalam array agar baris header tetap sesuai dengan baris body
      body: tableData.slice(1),
      startY: 25, // Menyesuaikan nilai startY untuk memberikan ruang yang cukup antara judul dan tabel
      theme: 'grid',
    });
  
    // Simpan file PDF
    doc.save('data_barang_keluar.pdf');
  };


  useEffect(() => {
    fetchAllKeluar();
  }, []);

  async function fetchAllKeluar() {
    const res = await fetch('http://localhost:3700/keluar', {
      method: 'GET',
    });
    if (res.ok) {
      const data: DataKeluar[] = await res.json();
      setDataKeluar(data);
      setIsTableEmpty(data.length === 0);
      console.log(data);
    } else {
      alert('error fetching');
    }
  }

  const handleDelete = async (idkeluar: string | null) => {
    if (idkeluar) {
      try {
        const response = await fetch(`http://localhost:3700/keluar/${idkeluar}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          const updatedDataKeluar = dataKeluar.filter((data) => data.idkeluar !== idkeluar);
          setDataKeluar(updatedDataKeluar);
          message.success('Data Berhasil Dihapus');
        } else {
          message.error('Data Gagal Dihapus');
        }
      } catch (error) {
        alert('Terjadi kesalahan saat menghapus data');
      }
    }
  };

  const handleDeleteConfirmation = (idkeluar: string | null) => {
    Modal.confirm({
      title: 'Hapus Data',
      content: 'Apakah anda yakin ingin menghapus data ini?',
      okText: 'Ya',
      okType: 'danger',
      cancelText: 'Batal',
      okButtonProps: {
        className: ' text-white',
      },
      onOk: () => handleDelete(idkeluar),
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Link href="/">
          <div className={"my-4 font-semibold text-xl text-center text-white bg-transparant rounded"}>
            <BlockOutlined /> 
            <h6>Gudang Raya</h6>
          </div>
        </Link>
        <Menu theme="dark" defaultSelectedKeys={['4']} mode="inline" items={items} />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item className="text-3xl font-semibold">Barang Keluar</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <button className="bg-blue-500 text-white p-2 px-4 rounded mb-2 hover:bg-blue-600" onClick={handleOpenTambahModal}>
                Tambah Barang
              </button>

              <button className="bg-green-500 text-white p-2 px-3 rounded mb-2 hover:bg-green-600" onClick={handlePrintPDF}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <FilePdfOutlined className='mr-2' />
                  Cetak PDF
                </span>
              </button>
            </div>
          </div>
            {showTambahModal && <TambahKeluarModal onClose={handleCloseTambahModal} masuk={[]} />}
            {showEditModal && <EditKeluarModal onClose={handleCloseEditModal} editData={editData} />}
            <div className='overflow-x-auto'>
            <div>
              <table className='w-full min-w-[800px]'>
                <thead>
                  <tr className="bg-slate-50">
                    <th className='py-2 w-5 border border-slate-100 text-left pl-3 pr-2'>No.</th>
                    <th className="py-3 border border-slate-100 text-left pl-6">Nama Barang</th>
                    <th className="py-2 border border-slate-100 text-left pl-6">Tanggal</th>
                    <th className="py-3 border border-slate-100 w-36 text-left pl-6">Jumlah</th>
                    <th className="py-3 border border-slate-100 text-left pl-6">Penerima</th>
                    <th className='py-3 border border-slate-100 w-32 text-left pl-3'>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {dataKeluar.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center border italic text-gray-400 border-slate-100">
                      data belum tersedia
                    </td>
                  </tr>
                  ) : (
                    dataKeluar.map((item, index) => (
                      <tr key={index} className={index % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                        <td className='py-3 px-3 text-center border border-slate-100'>{index + 1}</td>
                        <td className="py-3 px-6 border border-slate-100" data-idkeluar={item.idkeluar}>{item.nama_barang}</td>
                        <td className="py-3 px-6 border border-slate-100">{moment(item.tanggal).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')}</td>
                        <td className="py-3 px-6 border border-slate-100 w-6">{item.jumlah}</td>
                        <td className="py-3 px-6 border border-slate-100">{item.penerima}</td>
                        <td className='py-3 px-3 border border-slate-100'>
                          <button className="bg-yellow-500 text-white p-0.5 px-2 pb-2 rounded mr-1 hover:bg-yellow-600" onClick={() => handleOpenEditModal(item)}>
                            <EditOutlined />
                          </button>
                          <button className="bg-red-500 text-white p-0.5 px-2 pb-2 rounded hover:bg-red-600" onClick={() => handleDeleteConfirmation(item.idkeluar)}>
                            <DeleteOutlined />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Gudang Raya ©2023 Created by Hesa Raya Untara</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
