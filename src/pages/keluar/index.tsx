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
  UserOutlined,
} from '@ant-design/icons';
import { Dropdown, MenuProps, Modal, Spin, message } from 'antd';
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
];

type DataKeluar = {
  idkeluar: string;
  idbarang: string;
  tanggal: string;
  nama_barang: string;
  jumlah: number;
  penerima: string;
};

interface DataUser {
  name: string;
  lastLoginAt: Date;
}

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dataKeluar, setDataKeluar] = useState<DataKeluar[]>([]);
  const [editData, setEditData] = useState<DataKeluar>({
    idbarang: '',
    idkeluar: '',
    tanggal: '',
    nama_barang: '',
    penerima: '',
    jumlah: 0
  });
  const [isTableEmpty, setIsTableEmpty] = useState(true);
  const [dataUser, setDataUser] = useState<DataUser[]>([]);
  const [loggedIn, setLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  interface ModalFormProps {
    onClose: () => void;
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
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: 25,
      theme: 'grid',
    });
  
    // Simpan file PDF
    doc.save('data_barang_keluar.pdf');
  };

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

  const handleDeleteConfirmation = () => {
    Modal.confirm({
      title: 'Hapus Data',
      content: 'Apakah anda yakin ingin menghapus data ini?',
      okText: 'Ya',
      okType: 'danger',
      cancelText: 'Batal',
      okButtonProps: {
        className: ' text-white',
      },
      onOk: () => message.success('Data Berhasil Dihapus')
    });
  };

  useEffect(() => {
  
    // Simulating the component loading process
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  

  const menuItems = (
    <Menu.Item>
      <a className='flex items-center'>
        <UserOutlined className='mr-1'/>Hesa
      </a>
    </Menu.Item>
  );
  
  const menu = (
    <Menu>
      {menuItems}
      <Menu.Divider />
      <Link href="/login">
      <Menu.Item key="4" danger>
        <a className='flex items-center'>
          <LogoutOutlined className='mr-1'/>Log out
        </a>
      </Menu.Item>
      </Link>
    </Menu>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
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
        <Menu theme="dark" defaultSelectedKeys={['4']} mode="inline" items={items} />
      </Sider>
      <Layout className="site-layout">
      <Header style={{ padding: 0, background: colorBgContainer }}>
                <div className="flex items-center justify-end">
                  <div className="relative font-medium right-10">
                    <Dropdown overlay={menu} trigger={['click']}>
                      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                        Administrator ▾
                      </a>
                    </Dropdown>
                  </div>
                </div>
              </Header>
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
                <tr>
                        <td className='py-3 px-3 text-center border border-slate-100'>1</td>
                        <td className="py-3 px-6 border border-slate-100" >Kebaya Encim</td>
                        <td className="py-3 px-6 border border-slate-100">2023-06-12 11:58:04</td>
                        <td className="py-3 px-6 border border-slate-100 w-6">60</td>
                        <td className="py-3 px-6 border border-slate-100">Oleh-oleh Mpok Ipeh</td>
                        <td className='py-3 px-3 border border-slate-100'>
                          <button className="bg-yellow-500 text-white p-0.5 px-2 pb-2 rounded mr-1 hover:bg-yellow-600" onClick={handleOpenEditModal}>
                            <EditOutlined />
                          </button>
                          <button className="bg-red-500 text-white p-0.5 px-2 pb-2 rounded hover:bg-red-600" onClick={handleDeleteConfirmation}>
                            <DeleteOutlined />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className='py-3 px-3 text-center border border-slate-100'>2</td>
                        <td className="py-3 px-6 border border-slate-100" >Rak Besi Susun</td>
                        <td className="py-3 px-6 border border-slate-100">2023-06-10 15:28:46</td>
                        <td className="py-3 px-6 border border-slate-100 w-6">40</td>
                        <td className="py-3 px-6 border border-slate-100">TB Makmur Jaya</td>
                        <td className='py-3 px-3 border border-slate-100'>
                          <button className="bg-yellow-500 text-white p-0.5 px-2 pb-2 rounded mr-1 hover:bg-yellow-600" onClick={handleOpenEditModal}>
                            <EditOutlined />
                          </button>
                          <button className="bg-red-500 text-white p-0.5 px-2 pb-2 rounded hover:bg-red-600" onClick={handleDeleteConfirmation}>
                            <DeleteOutlined />
                          </button>
                        </td>
                      </tr>
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
