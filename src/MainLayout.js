import './MainLayout.css';
import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  AppstoreTwoTone,
  BarChartOutlined,
  BlockOutlined,
  BookOutlined,
  BookTwoTone,
  CarOutlined,
  CarTwoTone,
  ContainerOutlined,
  ContainerTwoTone,
  DownloadOutlined,
  FieldTimeOutlined,
  FileOutlined,
  FileTwoTone,
  HomeOutlined,
  HomeTwoTone,
  LogoutOutlined,
  MoneyCollectOutlined,
  MoneyCollectTwoTone,
  PartitionOutlined,
  PlusCircleTwoTone,
  PlusOutlined,
  PushpinOutlined,
  SettingOutlined,
  SettingTwoTone,
  ShoppingCartOutlined,
  ShoppingTwoTone,
  StockOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Layout, Menu, Modal, Space } from 'antd';
import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import axios from 'axios';
import { getUserIsAdmin, getUserIsLoggedIn, getUserLocationAddress, getUserLocationName, getUserName, getUserRole } from './utils/LocalData';

import menuLogo from './img/logos/logo.png';
import { GMenuExpensesIcon, GMenuPurchasesIcon } from './utils/IconImageProvider';
import { includes } from 'lodash';

const { Header, Content, Footer, Sider } = Layout;

const { confirm } = Modal;

function getCurrentSelectedMenuKeyByRoute(pathName) {
  switch(pathName) {
    case "/main": return "1";
    case "/main/sales/new": return "2";
    case "/main/sales/summary": return "3";
    case "/main/purchases/rawmaterials/new": return "4";
    case "/main/purchases/rawmaterials/summary": return "5";
    case "/main/purchases/products/new": return "6";
    case "/main/purchases/products/summary": return "7";
    case "/main/expenses/new": return "28";
    case "/main/expenses/summary": return "29";
    case "/main/productions/new": return "8";
    case "/main/productions/summary": return "9";
    case "/main/pending-accounts/to-collect": return "10";
    case "/main/pending-accounts/to-pay": return "11";
    case "/main/inventory/rawmaterial": return "12";
    case "/main/inventory/products": return "13";
    case "/main/my-cashier": return "14";
    case "/main/reports": return "15";
    case "/main/administration/cashiers": return "16";
    case "/main/administration/customers": return "17";
    case "/main/administration/users": return "18";
    case "/main/administration/suppliers": return "19";
    case "/main/administration/categories": return "20";
    case "/main/administration/brands": return "21";
    case "/main/administration/ubications": return "22";
    case "/main/administration/delivery-routes": return "23";
    case "/main/administration/general-data": return "24";
    case "/main/parking-checkouts/incomes": return "25";
    case "/main/parking-checkouts/expenses": return "26";
    case "/main/parking-checkouts/guards": return "27";
    case "/main/parking-checkouts/reports": return "28";
    case "/main/reports/shiftcuts": return "31";
    case "/main/transfers": return "32";
    default: return "1";
  }
}

function getCurrentOpenKeysByRoute(pathName) {
  switch(pathName) {
    case "/main": return [];
    case "/main/sales/new": return ["sub1"];
    case "/main/sales/summary": return ["sub1"];
    case "/main/purchases/rawmaterials/new": return ["sub2", "sub3"];
    case "/main/purchases/rawmaterials/summary": return ["sub2", "sub3"];
    case "/main/purchases/products/new": return ["sub2", "sub4"];
    case "/main/purchases/products/summary": return ["sub2", "sub4"];
    case "/main/expenses/new": return ["sub10"];
    case "/main/expenses/summary": return ["sub10"];
    case "/main/productions/new": return ["sub5"];
    case "/main/productions/summary": return ["sub5"];
    case "/main/prending-accounts/to-collect": return ["sub6"];
    case "/main/prending-accounts/to-pay": return ["sub6"];
    case "/main/inventory/rawmaterial": return ["sub7"];
    case "/main/inventory/products": return ["sub7"];
    case "/main/my-cashier": return [];
    case "/main/reports": return [];
    case "/main/administration/cashiers": return ["sub8"];
    case "/main/administration/customers": return ["sub8"];
    case "/main/administration/users": return ["sub8"];
    case "/main/administration/suppliers": return ["sub8"];
    case "/main/administration/categories": return ["sub8"];
    case "/main/administration/brands": return ["sub8"];
    case "/main/administration/ubications": return ["sub8"];
    case "/main/administration/delivery-routes": return ["sub8"];
    case "/main/administration/general-data": return ["sub8"];
    case "/main/parking-checkouts/incomes": return ["sub9"];
    case "/main/parking-checkouts/expenses": return ["sub9"];
    case "/main/parking-checkouts/guards": return ["sub9"];
    case "/main/parking-checkouts/reports": return ["sub9"];
    case "/main/reports/shiftcuts": return ["sub11"];
    case "/main/transfers": return [];
    default: return [];
  }
}

function getCurrentBreadcumbByRoute(pathName) {
  switch(pathName) {
    case "/main": return (<><Breadcrumb.Item>Principal</Breadcrumb.Item></>);
    case "/main/contracts": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Contratos</Breadcrumb.Item>
    </>);
    case "/main/sales": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Ventas</Breadcrumb.Item>
    </>);
    case "/main/sales/new": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Ventas</Breadcrumb.Item>
      <Breadcrumb.Item>Nueva Venta</Breadcrumb.Item>
    </>);
    case "/main/sales/summary": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Ventas</Breadcrumb.Item>
      <Breadcrumb.Item>Resumen</Breadcrumb.Item>
    </>);
    case "/main/purchases/rawmaterials/new": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Compras</Breadcrumb.Item>
      <Breadcrumb.Item>Materias Primas</Breadcrumb.Item>
      <Breadcrumb.Item>Nueva Compra</Breadcrumb.Item>
    </>);
    case "/main/purchases/rawmaterials/summary": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Compras</Breadcrumb.Item>
      <Breadcrumb.Item>Materias Primas</Breadcrumb.Item>
      <Breadcrumb.Item>Resumen</Breadcrumb.Item>
    </>);
    case "/main/purchases/products/new": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Compras</Breadcrumb.Item>
      <Breadcrumb.Item>Productos</Breadcrumb.Item>
      <Breadcrumb.Item>Nueva Compra</Breadcrumb.Item>
    </>);
    case "/main/purchases/products/summary": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Compras</Breadcrumb.Item>
      <Breadcrumb.Item>Productos</Breadcrumb.Item>
      <Breadcrumb.Item>Resumen</Breadcrumb.Item>
    </>);
    case "/main/expenses/new": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Gastos</Breadcrumb.Item>
      <Breadcrumb.Item>Nuevo Gasto</Breadcrumb.Item>
    </>);
    case "/main/expenses/summary": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Gastos</Breadcrumb.Item>
      <Breadcrumb.Item>Resumen</Breadcrumb.Item>
    </>);
    case "/main/productions/new": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Producciones</Breadcrumb.Item>
      <Breadcrumb.Item>Nueva Hoja Produccion</Breadcrumb.Item>
    </>);
    case "/main/productions/summary": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Producciones</Breadcrumb.Item>
      <Breadcrumb.Item>Resumen</Breadcrumb.Item>
    </>);
    case "/main/pending-accounts/to-collect": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Cuentas Pendientes</Breadcrumb.Item>
      <Breadcrumb.Item>Por Cobrar</Breadcrumb.Item>
    </>);
    case "/main/pending-accounts/to-pay": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Cuentas Pendientes</Breadcrumb.Item>
      <Breadcrumb.Item>Por pagar</Breadcrumb.Item>
    </>);
    case "/main/inventory/rawmaterials": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Inventario</Breadcrumb.Item>
      <Breadcrumb.Item>Materias Primas</Breadcrumb.Item>
    </>);
    case "/main/inventory/products": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Inventario</Breadcrumb.Item>
      <Breadcrumb.Item>Productos</Breadcrumb.Item>
    </>);
    case "/main/my-cashier": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Mi Caja</Breadcrumb.Item>
    </>);
    case "/main/reports": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Reportes</Breadcrumb.Item>
    </>);
    case "/main/reports/shiftcuts": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Reportes</Breadcrumb.Item>
      <Breadcrumb.Item>Cortes de caja</Breadcrumb.Item>
    </>);
    case "/main/administration/cashiers": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Administracion</Breadcrumb.Item>
      <Breadcrumb.Item>Cajas</Breadcrumb.Item>
    </>);
    case "/main/administration/customers": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Administracion</Breadcrumb.Item>
      <Breadcrumb.Item>Clientes</Breadcrumb.Item>
    </>);
    case "/main/administration/users": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Administracion</Breadcrumb.Item>
      <Breadcrumb.Item>Usuarios</Breadcrumb.Item>
    </>);
    case "/main/administration/suppliers": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Administracion</Breadcrumb.Item>
      <Breadcrumb.Item>Proveedores</Breadcrumb.Item>
    </>);
    case "/main/administration/categories": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Administracion</Breadcrumb.Item>
      <Breadcrumb.Item>Categorías</Breadcrumb.Item>
    </>);
    case "/main/administration/brands": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Administracion</Breadcrumb.Item>
      <Breadcrumb.Item>Marcas</Breadcrumb.Item>
    </>);
    case "/main/administration/ubications": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Administracion</Breadcrumb.Item>
      <Breadcrumb.Item>Ubicaciones</Breadcrumb.Item>
    </>);
    case "/main/administration/delivery-routes": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Administracion</Breadcrumb.Item>
      <Breadcrumb.Item>Rutas</Breadcrumb.Item>
    </>);
    case "/main/administration/general-data": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Administracion</Breadcrumb.Item>
      <Breadcrumb.Item>Datos Generales</Breadcrumb.Item>
    </>);
    case "/main/parking-checkouts/incomes": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Control de Parqueos</Breadcrumb.Item>
      <Breadcrumb.Item>Ingresos</Breadcrumb.Item>
    </>);
    case "/main/parking-checkouts/expenses": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Control de Parqueos</Breadcrumb.Item>
      <Breadcrumb.Item>Gastos</Breadcrumb.Item>
    </>);
    case "/main/parking-checkouts/guards": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Control de Parqueos</Breadcrumb.Item>
      <Breadcrumb.Item>Vigilantes</Breadcrumb.Item>
    </>);
    case "/main/parking-checkouts/reports": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Control de Parqueos</Breadcrumb.Item>
      <Breadcrumb.Item>Informes</Breadcrumb.Item>
    </>);
    case "/main/transfers": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Traslados</Breadcrumb.Item>
    </>);
    case "/main/transfers/new": return (<>
      <Breadcrumb.Item>Principal</Breadcrumb.Item>
      <Breadcrumb.Item>Traslados</Breadcrumb.Item>
      <Breadcrumb.Item>Nuevo</Breadcrumb.Item>
    </>);
    default: return (<></>);
  }
}

const MainLayout = () => {
  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState(getCurrentSelectedMenuKeyByRoute(pathname));
  
  const navigate = useNavigate();

  const roleId = getUserRole();

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  // LAST KEY: 32
  // LAST SUB: sub11
  const items = [
    getItem('Principal', '1', <HomeOutlined />),
    // getUserIsAdmin() ? getItem('Ctrl. Parqueos', 'sub9', <CarOutlined />, [
    //   getItem('Ingresos', '25', <DownloadOutlined />),
    //   getItem('Gastos', '26', <UploadOutlined />),
    //   getItem('Vigilantes', '27', <UserOutlined />),
    //   getItem('Informes', '28', <BarChartOutlined />)
    // ]) : null,
    includes([1, 2, 4, 5], roleId) ? getItem('Ventas', 'sub1', <StockOutlined />, [
      getItem('Nueva', '2', <PlusOutlined />),
      getItem('Resumen', '3', <BookOutlined />)
    ]) : null,
    includes([1, 2, 5], roleId) ? getItem(
      'Compras',
      'sub2',
      <ShoppingCartOutlined />,
      // <GMenuPurchasesIcon width='20px' addBackground backgroundMargin={5} backgroundPadding={0} />,
    [
      // getItem('Mat. Prima', 'sub3', null, [
      //   getItem('Nueva', '4', <PlusOutlined />),
      //   getItem('Resumen', '5', <BookOutlined />)
      // ]),
      getItem('Producto', 'sub4', null, [
        getItem('Nueva', '6', <PlusOutlined />),
        getItem('Resumen', '7', <BookOutlined />)
      ])
    ]) : null,
    includes([1, 2], roleId) ? getItem(
      'Gastos',
      'sub10',
      <DownloadOutlined />,
      // <GMenuExpensesIcon width='20px' addBackground backgroundMargin={5} backgroundPadding={0} />,
    [
      getItem('Nuevo', '29', <PlusOutlined />),
      getItem('Resumen', '30', <BookOutlined />)
    ]) : null,
    // getItem('Producción', 'sub5', <ShoppingCartOutlined />, [
    //   getItem('Nueva hoja', '8', <PlusOutlined />),
    //   getItem('Resumen', '9', <BookOutlined />)
    // ]),
    includes([1, 2, 4], roleId) ? getItem('Ctas. Pendientes', 'sub6', <MoneyCollectOutlined />, [
      includes([1, 2, 4], roleId) ? getItem('Por cobrar', '10', <PlusOutlined />) : null,
      includes([1, 2], roleId) ? getItem('Por pagar', '11', <BookOutlined />) : null
    ]) : null,
    getUserIsAdmin() && includes([1, 2, 5], roleId) ? getItem('Inventario', 'sub7', <AppstoreOutlined />, [
      // getItem('Mat. Prima', '12', <PlusOutlined />),
      getItem('Productos', '13', <BookOutlined />)
    ]) : null,
    includes([1, 2, 4, 5], roleId) ? getItem('Mi Caja', '14', <ContainerOutlined />) : null,
    // getUserIsAdmin() ? getItem('Reportes', '15', <FileOutlined />) : null,
    includes([1, 2, 4, 5], roleId) ? getItem('Traslados', '32', <CarOutlined />) : null,
    getUserIsAdmin() && includes([1, 2], roleId) ? getItem('Reportes', 'sub11', <FileOutlined />, [
      getItem('Cortes de caja', '31', <FieldTimeOutlined />)
    ]) : null,
    getUserIsAdmin() && includes([1, 2], roleId) ? getItem('Administración', 'sub8', <SettingOutlined />, [
      getItem('Cajas', '16', <ContainerOutlined />),
      getItem('Clientes', '17', <UserOutlined />),
      getItem('Usuarios', '18', <UserOutlined />),
      getItem('Proveedores', '19', <UserOutlined />),
      getItem('Categorias', '20', <AppstoreOutlined />),
      getItem('Marcas', '21', <BlockOutlined />),
      getItem('Ubicaciones', '22', <PushpinOutlined />),
      getItem('Rutas', '23', <PartitionOutlined />),
      // getItem('Datos Generales', '24', <ReadOutlined />),
    ]) : null,
    getItem('', '100'),
  ];

  function logoutAction() {
    confirm({
      title: '¿Desea salir?',
      icon: <LogoutOutlined />,
      content: 'Confirme cierre de sesión',
      okText: 'Salir',
      cancelText: 'Cancelar',
      onOk() {
        localStorage.removeItem('userData');
        localStorage.removeItem('userToken');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('permissionsData');
        axios.defaults.headers.common.authorization = '';
        axios.defaults.headers.common.idtoauth = '';
        navigate('/');
      },
      onCancel() {},
    });
  }

  return (   
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider
        className="site-sider"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo" style={{ display: collapsed ? 'none' : 'flex' }}>
          {/* <Avatar
            size={64}
            shape="square"
            style={{ marginBottom: 5 }}
            src={menuLogo}
          /> */}
          <img
            width={75}
            height={75}
            src={menuLogo}
            style={{ objectFit: 'cover' }}
          />
          <p style={{ margin: 0, fontWeight: 600 }}>
            {getUserLocationName()}
          </p>
          <p style={{ margin: 0, fontSize: 12 }}>
            {getUserLocationAddress()}
          </p>
        </div>
        {/* <div style={{ height: '350px', overflow: 'auto' }}> */}
          <Menu
            theme="dark"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={getCurrentOpenKeysByRoute(pathname)}
            mode="inline"
            items={items}
            selectedKeys={[selectedMenuKey]}
            onClick={(a) => {
              setSelectedMenuKey(a.key);
              switch(a.key) {
                case '1': navigate('/main'); break;
                case '2': navigate('/main/sales/new'); break;
                case '3': navigate('/main/sales/summary'); break;
                case '4': navigate('/main/purchases/rawmaterials/new'); break;
                case '5': navigate('/main/purchases/rawmaterials/summary'); break;
                case '6': navigate('/main/purchases/products/new'); break;
                case '7': navigate('/main/purchases/products/summary'); break;
                case '8': navigate('/main/productions/new'); break;
                case '9': navigate('/main/productions/summary'); break;
                case '10': navigate('/main/pending-accounts/to-collect'); break;
                case '11': navigate('/main/pending-accounts/to-pay'); break;
                case '12': navigate('/main/inventory/rawmaterials'); break;
                case '13': navigate('/main/inventory/products'); break;
                case '14': navigate('/main/my-cashier'); break;
                case '15': navigate('/main/reports'); break;
                case '16': navigate('/main/administration/cashiers'); break;
                case '17': navigate('/main/administration/customers'); break;
                case '18': navigate('/main/administration/users'); break;
                case '19': navigate('/main/administration/suppliers'); break;
                case '20': navigate('/main/administration/categories'); break;
                case '21': navigate('/main/administration/brands'); break;
                case '22': navigate('/main/administration/ubications'); break;
                case '23': navigate('/main/administration/delivery-routes'); break;
                case '24': navigate('/main/administration/general-data'); break;
                case '25': navigate('/main/parking-checkouts/incomes'); break;
                case '26': navigate('/main/parking-checkouts/expenses'); break;
                case '27': navigate('/main/parking-checkouts/guards'); break;
                case '28': navigate('/main/parking-checkouts/reports'); break;
                case '29': navigate('/main/expenses/new'); break;
                case '30': navigate('/main/expenses/summary'); break;
                case '31': navigate('/main/reports/shiftcuts'); break;
                case '32': navigate('/main/transfers'); break;
                default: navigate('/main'); break;
              }
            }}
          />
        {/* </div> */}
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: '0px 15px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Space size={'small'}>
              <Avatar size={32} style={{ backgroundColor: '#2f54eb' }} icon={<UserOutlined />} />
              <p style={{ margin: 0 }}>{`${getUserName()}`}</p>
              <p style={{ margin: 0, fontSize: 11, color: 'gray' }}>{`${getUserIsAdmin() ? 'Administrativo' : 'Operativo'}`}</p>
            </Space>
            <Button type={'primary'} danger icon={<LogoutOutlined />} onClick={() => logoutAction()}>Cerrar sesión</Button>
          </div>
        </Header>
        <Content
          className="site-layout-content"
          style={{
            margin: '0 16px'
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            {getCurrentBreadcumbByRoute(pathname)}
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 360
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
            height: 55
          }}
        >
          <p style={{ fontSize: 11, margin: 0, fontWeight: 600 }}>SigProCOM ©2023</p>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;