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
  RightOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
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
  getItem('Logout', '6', <LogoutOutlined />, undefined, '/login'),
];


const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [totalMasuk, setTotalMasuk] = useState(0);
  const [totalKeluar, setTotalKeluar] = useState(0);
  const [totalSupplier, setTotalSupplier] = useState(0);
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

  useEffect(() => {
    fetchAllMasuk();
    fetchAllKeluar();
    fetchAllSupplier();
  }, []);


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
        <Header style={{ padding: 0, background: colorBgContainer }} />
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
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Gudang Raya ©2023 Created by Hesa Raya Untara</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
