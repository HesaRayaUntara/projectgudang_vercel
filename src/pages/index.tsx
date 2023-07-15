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

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();

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
      <Menu.Item key="4" danger>
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
                      <a className="ant-dropdown-link">
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
                            <h3 className="text-4xl font-semibold mb-3">4</h3>
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
                            <h3 className="text-4xl font-semibold mb-3">4</h3>
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
                            <h3 className="text-4xl font-semibold mb-3">2</h3>
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
                            <h3 className="text-4xl font-semibold mb-3">3</h3>
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
                            <table>
                              <tr>
                                <td className="border border-gray-100 px-2 py-2 font-bold w-40">Username</td>
                                <td className="border border-gray-100 px-3 py-2 w-96">Hesa</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-100 px-2 py-2 font-bold w-40">Terakhir Login</td>
                                <td className="border border-gray-100 px-3 py-2 w-96">2023-06-12 23:01:43</td>
                              </tr>
                            </table>
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
