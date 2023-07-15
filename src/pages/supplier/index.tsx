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
  UserOutlined,
} from '@ant-design/icons';
import { Dropdown, MenuProps, Modal, Spin, message } from 'antd';
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
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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

  
    // Mencetak tabel menggunakan autoTable
    doc.autoTable({
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: 25,
      theme: 'grid',
    });
  
    // Simpan file PDF
    doc.save('data_supplier.pdf');
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
        <Menu theme="dark" defaultSelectedKeys={['5']} mode="inline" items={items} />
      </Sider>

        <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }}>
                <div className="flex items-center justify-end">
                  <div className="relative font-medium right-10">
                    <Dropdown overlay={menu} trigger={['click']}>
                      <a className="ant-dropdown-link">
                        Administrator ▾
                      </a>
                    </Dropdown>
                  </div>
                </div>
          </Header>
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
            {showEditModal && <EditSupplierModal onClose={handleCloseEditModal} />}
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
                      <tr>
                        <td className='py-3 px-3 border border-slate-100 text-center'>1</td>
                        <td className='py-3 px-3 border border-slate-100'>Rumah Batik</td>
                        <td className='py-3 px-3 border border-slate-100 w-2'>Gg. Adem Ayem</td>
                        <td className='py-3 px-3 border border-slate-100'>081234567890</td>
                        <td className='py-3 px-3 border border-slate-100'>
                          <button className="bg-yellow-500 text-white p-0.5 px-2 pb-2 rounded mr-1 hover:bg-yellow-600" onClick={handleOpenEditModal}>
                            <EditOutlined />
                          </button>
                          <button className="bg-red-500 text-white p-0.5 px-2 pb-2 rounded hover:bg-red-600" onClick={handleDeleteConfirmation}>
                            <DeleteOutlined />
                          </button>
                        </td>
                      </tr>
                      <tr className='bg-slate-50'>
                        <td className='py-3 px-3 border border-slate-100 text-center'>2</td>
                        <td className='py-3 px-3 border border-slate-100'>PT Satu Solusi</td>
                        <td className='py-3 px-3 border border-slate-100 w-2'>Jl. Bintara No.1</td>
                        <td className='py-3 px-3 border border-slate-100'>082100011223</td>
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
                        <td className='py-3 px-3 border border-slate-100 text-center'>3</td>
                        <td className='py-3 px-3 border border-slate-100'>KulBed</td>
                        <td className='py-3 px-3 border border-slate-100 w-2'>Jl. Mahoni Raya No.9</td>
                        <td className='py-3 px-3 border border-slate-100'>080812348686</td>
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