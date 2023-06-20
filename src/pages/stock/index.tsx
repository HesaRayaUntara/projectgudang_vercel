import React, { useEffect, useState } from 'react';
import {
  LogoutOutlined,
  BlockOutlined,
  AppstoreOutlined,
  DeploymentUnitOutlined,
  FilePdfOutlined,
  HomeOutlined,
  FileAddOutlined,
  ExportOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Dropdown, MenuProps, Spin } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import router, { useRouter } from 'next/router';
import EditStockModal from '@/pages/components/editstock';
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

interface DataMasuk {
  idbarang: string;
  idsupplier: string;
  nama_barang: string;
  jumlah: number;
  nama_supplier: string;
  keterangan: string;
}

interface DataUser {
  name: string;
  lastLoginAt: Date;
}

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dataMasuk, setDataMasuk] = useState<DataMasuk[]>([]);
  const [editData, setEditData] = useState<DataMasuk>({ idbarang: '', idsupplier: '', nama_barang: '', keterangan: '', nama_supplier: '', jumlah: 0 });
  const [dataUser, setDataUser] = useState<DataUser[]>([]);
  const [loggedIn, setLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const handlePrintPDF = () => {
  const doc = new jsPDF();

  // Membuat judul halaman
  doc.text('Data Stock Barang', 14, 20);

  // Membuat array untuk menyimpan data tabel
  const tableData = [];

  // Menambahkan header tabel
  const headers = ['No.', 'Nama Barang', 'Stock', 'Supplier', 'Keterangan'];
  tableData.push(headers);

  // Menambahkan data dari state dataMasuk ke dalam array tabel
  dataMasuk.forEach((item, index) => {
    const rowData = [index + 1, item.nama_barang, item.jumlah, item.nama_supplier, item.keterangan];
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
  doc.save('data_stock_barang.pdf');
};

  

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();

  const handleOpenEditModal = (data: DataMasuk) => {
    setEditData(data);
    setShowEditModal(true);
  };
  
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };
  
  interface ModalFormProps {
    onClose: () => void;
    editData: DataMasuk;
  }


  async function fetchAllMasuk() {
    const res = await fetch('http://localhost:3700/masuk', {
      method: 'GET',
    });
    if (res.ok) {
      const data = await res.json();
      setDataMasuk(data);
      console.log(data);
    } else {
      alert('error fetching');
    }
  }
  
  async function fetchAllUser() {
    const res = await fetch('http://localhost:3700/auth/login', {
      method: 'GET',
    });
    if (res.ok) {
      const data = await res.json();
      setDataUser(data);
      console.log(data);
    } else {
      alert('error fetching');
    }
  }

  useEffect(() => {
    fetchAllMasuk();
    fetchAllUser();

    const token = localStorage.getItem('token');
    if (!token) {
      setLoggedIn(false);
      router.push('/login');
    } else {
      setLoggedIn(true);
    }
  
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoading(true);
    setLoggedIn(false);
    router.push('/login');
  };

  const menuItems = dataUser.map((item) => (
    <Menu.Item key={item.name}>
      <a className='flex items-center'>
        <UserOutlined className='mr-1'/>{item.name}
      </a>
    </Menu.Item>
  ));
  
  const menu = (
    <Menu>
      {menuItems}
      <Menu.Divider />
      <Menu.Item key="4" danger onClick={handleLogout}>
        <a className='flex items-center'>
          <LogoutOutlined className='mr-1'/>Log out
        </a>
      </Menu.Item>
    </Menu>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!loggedIn) {
    router.replace('/login');
    return null;
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
        <Menu theme="dark" defaultSelectedKeys={['2']} mode="inline" items={items} />
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
            <Breadcrumb.Item className='text-3xl font-semibold'>Stock Barang</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>

          <button className="bg-green-500 text-white p-2 px-3 rounded mb-2 hover:bg-green-600" onClick={handlePrintPDF}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <FilePdfOutlined className='mr-2' />
              Cetak PDF
            </span>
          </button>

          {showEditModal && <EditStockModal onClose={handleCloseEditModal} editData={editData} />}
          <div className='overflow-x-auto'>
            <div>
            <table className='w-full min-w-[800px]'>
                <thead>
                  <tr className='bg-slate-50'>
                    <th className='py-2 border border-slate-100 text-center w-5'>No.</th>
                    <th className='py-3 border border-slate-100 text-left pl-6'>Nama Barang</th>
                    <th className='py-3 border border-slate-100 text-left pl-4 w-32'>Stock</th>
                    <th className='py-3 border border-slate-100 text-left pl-6 w-52'>Supplier</th>
                    <th className='py-3 border border-slate-100 text-left pl-6'>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {dataMasuk.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center border italic text-gray-400 border-slate-100">
                      data belum tersedia
                    </td>
                  </tr>
                  ) : (
                    dataMasuk.map((item, index) => (
                      <tr key={index} className={index % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                        <td className='py-3 px-6 border border-slate-100 text-center w-5'>{index + 1}</td>
                        <td className='py-3 px-6 border border-slate-100'>{item.nama_barang}</td>
                        <td className='py-3 px-4 border border-slate-100'>{item.jumlah}</td>
                        <td className='py-3 px-6 border border-slate-100'>{item.nama_supplier}</td>
                        <td className='py-3 px-6 border border-slate-100'>{item.keterangan}</td>                    
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