
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Dashboard from '@/pages/Dashboard';
import Trucks from '@/pages/Trucks';
import TruckDetail from '@/pages/TruckDetail';
import Vans from '@/pages/Vans';
import VanDetail from '@/pages/VanDetail';
import Reports from '@/pages/Reports';
import Packages from '@/pages/Packages';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trucks" element={<Trucks />} />
          <Route path="/trucks/:id" element={<TruckDetail />} />
          <Route path="/vans" element={<Vans />} />
          <Route path="/vans/:id" element={<VanDetail />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
