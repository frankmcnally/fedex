
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Truck, Car, BarChart3, Package } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Totals', icon: Building2, path: '/' },
    { label: 'Trucks', icon: Truck, path: '/trucks' },
    { label: 'Vans', icon: Car, path: '/vans' },
    { label: 'Packages', icon: Package, path: '/packages' },
    { label: 'Reports', icon: BarChart3, path: '/reports' },
  ];

  return (
    <nav className="bg-white shadow-md rounded-xl p-2 mb-8">
      <ul className="flex flex-wrap items-center justify-between sm:justify-start gap-2">
        {navItems.map((item) => {
          // Determine if this tab is active
          // For root '/', only active if exact match
          // For others, active if path starts with item.path (handles detail pages)
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);
          
          return (
            <li key={item.path} className="flex-1 sm:flex-none">
              <Link
                to={item.path}
                className={`
                  flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium
                  ${isActive 
                    ? 'bg-[#4d148c] text-white shadow-sm font-bold' 
                    : 'text-gray-600 hover:text-[#ff6600] hover:bg-gray-50'
                  }
                `}
              >
                <item.icon size={20} className={isActive ? 'text-white' : ''} />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden text-xs">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
