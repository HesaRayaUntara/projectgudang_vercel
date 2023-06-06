import React, { useState, useEffect } from 'react';
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
import TambahSupplierModal from '@/pages/components/tambahsupplier';
import EditSupplierModal from '@/pages/components/editsupplier';
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
  };
}

const items: MenuItem[] = [
  getItem('Dashboard', '1', <HomeOutlined />, undefined, '/'),
  getItem('Stock Barang', '2', <AppstoreOutlined />, undefined, '/stock'),
  getItem('Barang Masuk', '3', <FileAddOutlined />, undefined, '/masuk'),
  getItem('Barang Keluar', '4', <ExportOutlined />, undefined, '/keluar'),
  getItem('Supplier', '5', <DeploymentUnitOutlined />, undefined, '/supplier'),
  getItem('Logout', '6', <LogoutOutlined />, undefined, '/login'),
];

interface DataSupplier {
  idsupplier: string;
  nama_supplier: string;
  alamat: string;
  telepon: number;
}

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dataSupplier, setDataSupplier] = useState<DataSupplier[]>([]);
  const [editData, setEditData] = useState<DataSupplier>({ idsupplier: '', nama_supplier: '', alamat: '', telepon: 0});
  const router = useRouter();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleOpenTambahModal = () => {
    setShowTambahModal(true);
  };

  const handleCloseTambahModal = () => {
    setShowTambahModal(false);
  };

  const handleOpenEditModal = (data: DataSupplier) => {
    setEditData(data); // Set data yang akan diedit
    setShowEditModal(true); // Buka modal form
  };
  
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };
  
  interface ModalFormProps {
    onClose: () => void;
    editData: DataSupplier; // Menghapus 'Partial'
  }
  
  const handlePrintPDF = () => {
    const doc = new jsPDF();
  
    // Membuat judul halaman
    doc.text('Data Supplier', 14, 20);
  
    // Membuat array untuk menyimpan data tabel
    const tableData = [];
  
    // Menambahkan header tabel
    const headers = ['No.', 'Nama Supplier', 'Alamat', 'Telepon'];
    tableData.push(headers);
  
    // Menambahkan data dari state dataMasuk ke dalam array tabel
    dataSupplier.forEach((item, index) => {
      const rowData = [index + 1, item.nama_supplier, item.alamat, item.telepon];
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
    doc.save('data_supplier.pdf');
  };

  
  const handleDelete = async (idsupplier: string | null) => {
    if (idsupplier) {
      try {
        const response = await fetch(`http://localhost:3700/supplier/${idsupplier}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          const updatedDataSupplier = dataSupplier.filter((data) => data.idsupplier !== idsupplier);
          setDataSupplier(updatedDataSupplier);
          message.success('Data Berhasil Dihapus');
        } else {
          message.success('Data Berhasil Dihapus');
        }
      } catch (error) {
        alert('Terjadi kesalahan saat menghapus data');
      }
    }
  };

  const handleDeleteConfirmation = (idsupplier: string | null) => {
    Modal.confirm({
      title: 'Hapus Data',
      content: 'Apakah anda yakin ingin menghapus data ini?',
      okText: 'Ya',
      okType: 'danger',
      cancelText: 'Batal',
      okButtonProps: {
        className: ' text-white',
      },
      onOk: () => handleDelete(idsupplier),
    });
  };
  
  

  useEffect(() => {
    fetchAllSupplier();
  }, []);

  async function fetchAllSupplier() {
    const res = await fetch('http://localhost:3700/supplier', {
      method: 'GET',
    });
    if (res.ok) {
      const data = await res.json();
      setDataSupplier(data);
      console.log(data);
    } else {
      alert('error fetching');
    }
  }
  

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Link href="/">
          <div className={"my-4 font-semibold text-xl text-center text-white bg-transparant rounded"}>
            <BlockOutlined /> 
            <h6>Gudang Raya</h6>
          </div>
        </Link>
        <Menu theme="dark" defaultSelectedKeys={['5']} mode="inline" items={items} />
      </Sider>

        <Layout className="site-layout">
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item className='text-3xl font-semibold'>Supplier</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            <div className="container mx-auto">
              <div className="flex justify-between items-center">
                <button className="bg-blue-500 text-white p-2 px-4 rounded mb-2 hover:bg-blue-600" onClick={handleOpenTambahModal}>
                  Tambah Supplier
                </button>

                <button className="bg-green-500 text-white p-2 px-3 rounded mb-2 hover:bg-green-600" onClick={handlePrintPDF}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <FilePdfOutlined className='mr-2' />
                    Cetak PDF
                  </span>
                </button>
              </div>
            </div>

            {showTambahModal && <TambahSupplierModal onClose={handleCloseTambahModal} />}
            {showEditModal && <EditSupplierModal onClose={handleCloseEditModal} editData={editData} />}
            <div className='overflow-x-auto'>
            <div>
            <table className='w-full min-w-[800px]'>
                <thead>
                  <tr className='bg-slate-50'>
                    <th className='py-2 w-5 border border-slate-100 text-center'>No.</th>
                    <th className='py-3 border border-slate-100 w-52 text-left pl-3'>Nama Supplier</th>
                    <th className='py-3 border border-slate-100 w-48 text-left pl-3'>Alamat</th>
                    <th className='py-3 border border-slate-100 w-24 text-left pl-3'>Telepon</th>
                    <th className='py-3 border border-slate-100 w-24 text-left pl-3'>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSupplier.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center border italic text-gray-400 border-slate-100">
                      data belum tersedia
                    </td>
                  </tr>
                  ) : (
                    dataSupplier.map((item, index) => (
                      <tr key={index} className={index % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                        <td className='py-3 px-3 border border-slate-100 text-center'>{index + 1}</td>
                        <td className='py-3 px-3 border border-slate-100' data-idsupplier={item.idsupplier}>{item.nama_supplier}</td>
                        <td className='py-3 px-3 border border-slate-100 w-2'>{item.alamat}</td>
                        <td className='py-3 px-3 border border-slate-100'>{item.telepon}</td>
                        <td className='py-3 px-3 border border-slate-100'>
                          <button className="bg-yellow-500 text-white p-0.5 px-2 pb-2 rounded mr-1 hover:bg-yellow-600" onClick={() => handleOpenEditModal(item)}>
                            <EditOutlined />
                          </button>
                          <button className="bg-red-500 text-white p-0.5 px-2 pb-2 rounded hover:bg-red-600" onClick={() => handleDeleteConfirmation(item.idsupplier)}>
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