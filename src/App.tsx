import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import MainLayout from './components/Common/MainLayout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ResetPassword from './components/Auth/ResetPassword';
import ChangePassword from './components/Auth/ChangePassword';
import Dashboard from './pages/Dashboard';
import EmployeeManagement from './components/Master/EmployeeManagement';
import EquipmentManagement from './components/Master/EquipmentManagement';
import EquipmentBooking from './components/Equipment/EquipmentBooking';
import CertificateUpload from './components/WorkCertificate/CertificateUpload';
import HistoryViewer from './components/Common/HistoryViewer';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="change-password" element={<ChangePassword />} />

              <Route
                path="master/employees"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <EmployeeManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="master/equipments"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <EquipmentManagement />
                  </ProtectedRoute>
                }
              />

              <Route path="equipment/booking" element={<EquipmentBooking />} />
              <Route path="certificates" element={<CertificateUpload />} />
              <Route path="history" element={<HistoryViewer />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;