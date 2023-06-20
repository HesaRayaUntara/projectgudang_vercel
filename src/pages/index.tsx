import React, { useEffect, useState } from 'react';
import { 
  LogoutOutlined,
  BlockOutlined,
  AppstoreOutlined,
  DeploymentUnitOutlined,
  HomeOutlined,
  FileAddOutlined,
  ExportOutlined,
  RightOutlined,
  CaretDownOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Dropdown, MenuProps, Modal, Spin } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import router, { useRouter } from 'next/router';
import EditStockModal from '@/pages/components/editstock';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import 'moment-timezone';

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


interface DataUser {
  name: string;
  lastLoginAt: Date;
}


const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [totalMasuk, setTotalMasuk] = useState(0);
  const [totalKeluar, setTotalKeluar] = useState(0);
  const [totalSupplier, setTotalSupplier] = useState(0);
  const [dataUser, setDataUser] = useState<DataUser[]>([]);
  const [loggedIn, setLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();


  async function fetchAllMasuk() {
    const res = await fetch('http://localhost:3700/masuk', {
      method: 'GET',
    });
    if (res.ok) {
      const data = await res.json();
      setTotalMasuk(data.length);
      console.log(data);
    } else {
      alert('error fetching');
    }
  }


  async function fetchAllKeluar() {
    const res = await fetch('http://localhost:3700/keluar', {
      method: 'GET',
    });
    if (res.ok) {
      const data = await res.json();
      setTotalKeluar(data.length);
      console.log(data);
    } else {
      alert('error fetching');
    }
  }


  async function fetchAllSupplier() {
    const res = await fetch('http://localhost:3700/supplier', {
      method: 'GET',
    });
    if (res.ok) {
      const data = await res.json();
      setTotalSupplier(data.length);
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
    fetchAllKeluar();
    fetchAllSupplier();
    fetchAllUser();

    const token = localStorage.getItem('token');
    if (!token) {
      setLoggedIn(false);
      router.push('/login');
    } else {
      setLoggedIn(true);
    }
  
    // Simulating the component loading process
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoading(true); // Set isLoading to true before logout
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
                  <div className={'my-4 font-semibold text-xl text-center text-white bg-transparant rounded'}>
                    <BlockOutlined />
                    <h6>Gudang Raya</h6>
                  </div>
                </Link>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
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
                    <Breadcrumb.Item className="text-3xl font-semibold">Dashboard</Breadcrumb.Item>
                  </Breadcrumb>
                  <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 h-36">
                      {/* Card 1 */}
                      <div className="bg-blue-400 p-4 rounded shadow relative text-white">
                        <div className="flex">
                          <div className="flex-grow">
                            <h3 className="text-4xl font-semibold mb-3">{totalMasuk}</h3>
                            <p>Jenis Barang</p>
                          </div>
                          <div>
                            <AppstoreOutlined className="text-6xl mr-3 -mt-3 text-black opacity-10" />
                          </div>
                        </div>
                        <Link href="/stock" className='hover:text-white'>
                          <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-10 py-2 p-4 rounded-b">
                            <div className="flex justify-between items-center">
                              <p className="flex items-center">View Details</p>
                              <div className="flex items-center">
                                <RightOutlined />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      {/* Card 2 */}
                      <div className="bg-yellow-400 p-4 rounded shadow relative text-white">
                        <div className="flex">
                          <div className="flex-grow">
                            <h3 className="text-4xl font-semibold mb-3">{totalMasuk}</h3>
                            <p>Barang Masuk</p>
                          </div>
                          <div>
                            <FileAddOutlined className="text-6xl mr-3 -mt-3 text-black opacity-10" />
                          </div>
                        </div>
                        <Link href="/masuk" className='hover:text-white'>
                          <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-10 py-2 p-4 rounded-b">
                            <div className="flex justify-between items-center">
                              <p className="flex items-center">View Details</p>
                              <div className="flex items-center">
                                <RightOutlined />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      {/* Card 3 */}
                      <div className="bg-red-500 p-4 rounded shadow relative text-white">
                        <div className="flex">
                          <div className="flex-grow">
                            <h3 className="text-4xl font-semibold mb-3">{totalKeluar}</h3>
                            <p>Data Barang keluar</p>
                          </div>
                          <div>
                            <ExportOutlined className="text-6xl mr-0.5 -mt-3 text-black opacity-10" />
                          </div>
                        </div>
                        <Link href="/keluar" className='hover:text-white'>
                          <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-10 py-2 p-4 rounded-b">
                            <div className="flex justify-between items-center">
                              <p className="flex items-center">View Details</p>
                              <div className="flex items-center">
                                <RightOutlined />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      {/* Card 4 */}
                      <div className="bg-green-500 p-4 rounded shadow relative text-white">
                        <div className="flex">
                          <div className="flex-grow">
                            <h3 className="text-4xl font-semibold mb-3">{totalSupplier}</h3>
                            <p>Supplier</p>
                          </div>
                          <div>
                            <DeploymentUnitOutlined className="text-6xl mr-3 -mt-3 text-black opacity-10" />
                          </div>
                        </div>
                        <Link href="/supplier" className='hover:text-white'>
                          <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-10 py-2 p-4 rounded-b">
                            <div className="flex justify-between items-center">
                              <p className="flex items-center">View Details</p>
                              <div className="flex items-center">
                                <RightOutlined />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 h-36 mt-8 mb-5">
                      {/* Card 5 */}
                      <div className="bg-white p-4 rounded shadow border-t-2 border-t-blue-400 relative text-black w-96">
                          <div className="flex">
                            <div className="flex-grow">
                              <h3 className="text-lg font-medium font mb-3 text-gray-800">Detail Login</h3>
                            </div>
                          </div>
                          <div>
                            {dataUser.map((item) => (
                            <table>
                              <tr>
                                <td className="border border-gray-100 px-2 py-2 font-bold w-40">Username</td>
                                <td className="border border-gray-100 px-3 py-2 w-96">{item.name}</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-100 px-2 py-2 font-bold w-40">Terakhir Login</td>
                                <td className="border border-gray-100 px-3 py-2 w-96">{moment(item.lastLoginAt).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')}</td>
                              </tr>
                            </table>
                            ))}
                        </div>
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
