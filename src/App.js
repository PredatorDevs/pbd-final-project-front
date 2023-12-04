import './App.css';

import React, { useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate } from "react-router-dom";

import { ProtectedRoute } from './utils/ProtectedRoute';
import { getUserIsLoggedIn } from './utils/LocalData';
import { customNot } from './utils/Notifications';

import { checkToken } from './services/AuthServices';

import ComponentToPrint from './components/tickets/ComponentToPrint';
import Customers from './pages/Customers';
import Login from './pages/Login';
import MainLayout from './MainLayout';
import Page403 from './pages/Page403';
import Page404 from './pages/Page404';
import TokenExpired from './pages/TokenExpired';
import NewSale from './pages/sales/NewSale';
import Sales from './pages/Sales';
import Products from './pages/inventory/Products';
import Users from './pages/Users';
import Suppliers from './pages/Suppliers';
import Categories from './pages/Categories';
import Brands from './pages/Brands';
import Ubications from './pages/Ubications';
import DeliveryRoutes from './pages/DeliveryRoutes';
import NewProductPurchase from './pages/purchases/NewProductPurchase';
import ProductPurchases from './pages/ProductPurchases';
import Cashiers from './pages/Cashiers';
import MyCashier from './pages/MyCashier';
import PageUnderConstruction from './pages/PageUnderConstruction';
import ParkingCheckouts from './pages/ParkingCheckouts';
import ParkingGuards from './pages/ParkingGuards';
import ParkingExpenses from './pages/ParkingExpenses';
import ParkingReports from './pages/ParkingReports';
import PendingSales from './pages/pendingaccounts/PendingSales';
import PendingPurchases from './pages/pendingaccounts/PendingPurchases';
import Expenses from './pages/Expenses';
import NewExpense from './pages/expenses/NewExpense';
import Settlements from './pages/reports/Settlements';
import Transfers from './pages/Transfers';
import NewTransfer from './pages/transfers/NewTransfer';

const App = () => {
  const isLoggedIn = getUserIsLoggedIn();

  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    if (token === null) {
      navigate('/')
    } else {
      checkToken()
      .then((response) => {
        customNot('success', 'Sesión válida', 'Sus credenciales aún no expiran');
      })
      .catch((res) => {
        customNot('warning', 'Sesión expirada', 'Sus credenciales han expirado');
        localStorage.removeItem('userData');
        localStorage.removeItem('userToken');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('permissionsData');
        axios.defaults.headers.common.authorization = '';
        axios.defaults.headers.common.idtoauth = '';
        navigate('/tokenexpired');
      });
    }
  }, []);

  function renderProtectedRoute(
    routePath = '', 
    allowedRoles = [], 
    childComponent = (<div></div>)
  ) {
    return (
      <Route 
        path={routePath}
        element={
          <ProtectedRoute user={isLoggedIn} roles={allowedRoles}>
            {childComponent}
          </ProtectedRoute>
        }
      />
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/print" element={<ComponentToPrint />}></Route>
      <Route
        path="/main/*"
        element={
          <ProtectedRoute user={isLoggedIn} roles={[1, 2, 3, 4, 5, 6]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >        
        {renderProtectedRoute('', [1, 2, 4, 5], <>Home Page</>)}
        {renderProtectedRoute('contracts', [1, 2], <>Contratos</>)}
        {renderProtectedRoute('sales', [1, 2, 4, 5], <>Ventas</>)}
        {renderProtectedRoute('sales/new', [1, 2, 4, 5], <NewSale />)}
        {renderProtectedRoute('sales/summary', [1, 2, 4, 5], <Sales />)}
        {renderProtectedRoute('purchases/products/new', [1, 2], <NewProductPurchase />)}
        {renderProtectedRoute('purchases/products/summary', [1, 2], <ProductPurchases />)}
        {renderProtectedRoute('expenses/new', [1, 2], <NewExpense />)}
        {renderProtectedRoute('expenses/summary', [1, 2], <Expenses />)}
        {renderProtectedRoute('pending-accounts/to-collect', [1, 2, 4], <PendingSales />)}
        {renderProtectedRoute('pending-accounts/to-pay', [1, 2], <PendingPurchases />)}
        {renderProtectedRoute('inventory/products', [1, 2], <Products />)}
        {renderProtectedRoute('my-cashier', [1, 2, 4, 5], <MyCashier />)}
        {renderProtectedRoute('reports', [1, 2], <PageUnderConstruction />)}
        {renderProtectedRoute('reports/shiftcuts', [1, 2], <Settlements />)}
        {renderProtectedRoute('administration/cashiers', [1, 2], <Cashiers />)}
        {renderProtectedRoute('administration/customers', [1, 2], <Customers />)}
        {renderProtectedRoute('administration/users', [1, 2], <Users />)}
        {renderProtectedRoute('administration/suppliers', [1, 2], <Suppliers />)}
        {renderProtectedRoute('administration/categories', [1, 2], <Categories />)}
        {renderProtectedRoute('administration/brands', [1, 2], <Brands />)}
        {renderProtectedRoute('administration/ubications', [1, 2], <Ubications />)}
        {renderProtectedRoute('administration/delivery-routes', [1, 2], <DeliveryRoutes />)}
        {renderProtectedRoute('parking-checkouts/incomes', [1, 2], <ParkingCheckouts />)}
        {renderProtectedRoute('parking-checkouts/expenses', [1, 2], <ParkingExpenses />)}
        {renderProtectedRoute('parking-checkouts/guards', [1, 2], <ParkingGuards />)}
        {renderProtectedRoute('parking-checkouts/reports', [1, 2], <ParkingReports />)}
        {renderProtectedRoute('transfers', [1, 2, 4, 5], <Transfers />)}
        {renderProtectedRoute('transfers/new', [1, 2, 5], <NewTransfer />)}
        <Route path='*' element={<Page404 />} />
      </Route>
      <Route path="/noauth" element={<Page403 />}></Route>
      <Route path="/tokenexpired" element={<TokenExpired />}></Route>
      <Route path='*' element={<Page404 />} />
    </Routes>
  );
};
export default App;
