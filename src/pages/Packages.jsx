
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { Truck, Car, ChevronDown, ChevronUp, Save, Edit2, X, Package as PackageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Card from '@/components/Card';
import { storage } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';

const PackageRow = ({ pkg, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    recipient_name: pkg.recipient_name || '',
    address_1: pkg.address_1 || '',
    address_2: pkg.address_2 || '',
    city: pkg.city || '',
    state: pkg.state || '',
    zip: pkg.zip || ''
  });
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Update recipient
    storage.updatePackageRecipient(pkg.id, formData.recipient_name);
    
    // Update address
    storage.updatePackageAddress(pkg.id, {
      address_1: formData.address_1,
      address_2: formData.address_2,
      city: formData.city,
      state: formData.state,
      zip: formData.zip
    });

    toast({
      title: "Package Updated",
      description: `Updated details for ${pkg.id}`,
    });

    setIsEditing(false);
    onUpdate();
  };

  const handleCancel = () => {
    setFormData({
      recipient_name: pkg.recipient_name || '',
      address_1: pkg.address_1 || '',
      address_2: pkg.address_2 || '',
      city: pkg.city || '',
      state: pkg.state || '',
      zip: pkg.zip || ''
    });
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div id={`pkg-${pkg.id}`} className={`border-b last:border-0 border-gray-100 p-4 hover:bg-gray-50 transition-colors ${isEditing ? 'bg-orange-50' : ''}`}>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex items-start gap-4 flex-1">
          <div className="bg-gray-100 p-2 rounded-lg mt-1">
            <PackageIcon size={20} className="text-[#4d148c]" />
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-bold text-[#4d148c]">{pkg.id}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${getStatusColor(pkg.status)}`}>
                {pkg.status}
              </span>
            </div>

            {isEditing ? (
              <div className="space-y-3 w-full max-w-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Recipient Name</label>
                    <input
                      name="recipient_name"
                      value={formData.recipient_name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-[#4d148c] focus:outline-none"
                      placeholder="Recipient Name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Address 1</label>
                    <input
                      name="address_1"
                      value={formData.address_1}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-[#4d148c] focus:outline-none"
                      placeholder="Street Address"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Address 2</label>
                    <input
                      name="address_2"
                      value={formData.address_2}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-[#4d148c] focus:outline-none"
                      placeholder="Apt, Suite, etc. (Optional)"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 col-span-1 md:col-span-2">
                    <div className="col-span-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">City</label>
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-[#4d148c] focus:outline-none"
                        placeholder="City"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">State</label>
                      <input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-[#4d148c] focus:outline-none"
                        placeholder="State"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Zip</label>
                      <input
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-[#4d148c] focus:outline-none"
                        placeholder="Zip Code"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1 bg-[#4d148c] text-white px-3 py-1 rounded text-sm hover:bg-[#3b0f6b] transition-colors"
                  >
                    <Save size={14} /> Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-gray-800">{pkg.recipient_name || 'No Recipient'}</p>
                <p className="text-sm text-gray-600">
                  {pkg.address_1 || 'No Address'}
                  {pkg.address_2 && `, ${pkg.address_2}`}
                </p>
                <p className="text-sm text-gray-600">
                  {pkg.city ? `${pkg.city}, ` : ''}{pkg.state} {pkg.zip}
                </p>
              </div>
            )}
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-[#ff6600] hover:bg-orange-50 rounded-full transition-colors self-start md:self-center"
            title="Edit Package Details"
          >
            <Edit2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

const Packages = () => {
  const location = useLocation();
  const [truckPackages, setTruckPackages] = useState([]);
  const [vanPackages, setVanPackages] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    trucks: false,
    vans: false
  });
  const [highlightedPackageId, setHighlightedPackageId] = useState(null);

  // Load data
  const loadData = () => {
    setTruckPackages(storage.getPackagesByVehicleType('truck'));
    setVanPackages(storage.getPackagesByVehicleType('van'));
  };

  useEffect(() => {
    loadData();
    const unsubscribe = storage.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  // Handle navigation state from other pages
  useEffect(() => {
    if (location.state) {
      if (location.state.expandTrucks) {
        setExpandedSections(prev => ({ ...prev, trucks: true }));
      }
      if (location.state.expandVans) {
        setExpandedSections(prev => ({ ...prev, vans: true }));
      }
      if (location.state.highlightPackageId) {
        setHighlightedPackageId(location.state.highlightPackageId);
        // Scroll to element after a slight delay to allow rendering
        setTimeout(() => {
          const element = document.getElementById(`pkg-${location.state.highlightPackageId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('bg-yellow-100');
            setTimeout(() => {
              element.classList.remove('bg-yellow-100');
            }, 2000);
          }
        }, 300);
      }
    }
  }, [location.state, truckPackages.length, vanPackages.length]); // Dependencies to ensure data is loaded before scroll

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Deduplicate packages to ensure unique keys
  const uniqueTruckPackages = truckPackages.filter((pkg, index, self) => 
    index === self.findIndex((t) => t.id === pkg.id)
  );
  const uniqueVanPackages = vanPackages.filter((pkg, index, self) => 
    index === self.findIndex((t) => t.id === pkg.id)
  );

  return (
    <>
      <Helmet>
        <title>Packages - Fleet Manager</title>
        <meta name="description" content="Manage packages for all trucks and vans" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <Navigation />

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Package Management</h1>
          </div>

          <div className="space-y-6">
            {/* Trucks Section */}
            <Card className="overflow-hidden p-0">
              <div 
                className="bg-white p-6 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                onClick={() => toggleSection('trucks')}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#4d148c] text-white p-3 rounded-xl shadow-md">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Truck Packages</h2>
                    <p className="text-sm text-gray-500">{uniqueTruckPackages.length} packages total</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedSections.trucks ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="text-gray-400" size={24} />
                </motion.div>
              </div>

              <AnimatePresence>
                {expandedSections.trucks && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-100"
                  >
                    <div className="bg-white">
                      {uniqueTruckPackages.length > 0 ? (
                        uniqueTruckPackages.map(pkg => (
                          <PackageRow key={pkg.id} pkg={pkg} onUpdate={loadData} />
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          No packages assigned to trucks.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Vans Section */}
            <Card className="overflow-hidden p-0">
              <div 
                className="bg-white p-6 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                onClick={() => toggleSection('vans')}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#ff6600] text-white p-3 rounded-xl shadow-md">
                    <Car size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Van Packages</h2>
                    <p className="text-sm text-gray-500">{uniqueVanPackages.length} packages total</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedSections.vans ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="text-gray-400" size={24} />
                </motion.div>
              </div>

              <AnimatePresence>
                {expandedSections.vans && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-100"
                  >
                    <div className="bg-white">
                      {uniqueVanPackages.length > 0 ? (
                        uniqueVanPackages.map(pkg => (
                          <PackageRow key={pkg.id} pkg={pkg} onUpdate={loadData} />
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          No packages assigned to vans.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Packages;
