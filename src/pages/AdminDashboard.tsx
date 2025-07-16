import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import ShipmentList from '../components/admin/ShipmentList';
import ShipmentForm from '../components/admin/ShipmentForm';
import ShipmentDetails from '../components/admin/ShipmentDetails';
import AdminProfile from '../components/admin/AdminProfile';
import AdminSettings from '../components/admin/AdminSettings';
import { Menu } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden fixed bottom-6 left-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
        <AdminHeader />
        
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<ShipmentList />} />
            <Route path="/shipments" element={<ShipmentList />} />
            <Route path="/shipments/new" element={<ShipmentForm />} />
            <Route path="/shipments/:id" element={<ShipmentDetails />} />
            <Route path="/shipments/:id/edit" element={<ShipmentForm />} />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;