
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Truck, Package, Plus, Minus, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '@/components/Card';
import CircleProgress from '@/components/CircleProgress';
import Navigation from '@/components/Navigation';
import EditableNameField from '@/components/EditableNameField';
import { storage } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';

const TruckDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [truck, setTruck] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data initially and on updates
  const loadTruckData = () => {
    const truckData = storage.getTruck(id);
    const packagesData = storage.getTruckPackages(id);
    
    if (truckData) {
      setTruck(truckData);
      setPackages(packagesData);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTruckData();

    // Subscribe to storage changes for real-time updates
    const unsubscribe = storage.subscribe(() => {
      loadTruckData();
    });

    return () => unsubscribe();
  }, [id]);

  const handleIncrement = () => {
    if (packages.length < truck.capacity) {
      storage.addPackage({ truck_id: truck.id });
      // UI update happens via storage subscription
    } else {
      toast({
        title: "Capacity Reached",
        description: "This truck is already full.",
        variant: "destructive",
      });
    }
  };

  const handleDecrement = () => {
    if (packages.length > 0) {
      storage.removePackage({ truck_id: truck.id });
      // UI update happens via storage subscription
    }
  };

  const handleUpdateName = async (newName) => {
    const result = storage.updateTruckName(truck.id, newName);
    
    if (result.success) {
      toast({
        title: "Success",
        description: "Truck name updated successfully",
      });
      // State updates automatically via subscription in useEffect
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
    
    return result;
  };

  const handlePackageClick = (pkgId) => {
    navigate('/packages', { 
      state: { 
        expandTrucks: true, 
        highlightPackageId: pkgId 
      } 
    });
  };

  if (loading || !truck) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#4d148c] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading truck details...</p>
        </div>
      </div>
    );
  }

  const percentage = (packages.length / truck.capacity) * 100;

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Deduplicate packages to ensure unique keys
  const uniquePackages = packages
    .filter((pkg, index, self) => index === self.findIndex((t) => t.id === pkg.id))
    .slice()
    .reverse();

  return (
    <>
      <Helmet>
        <title>{truck.name} - Fleet Manager</title>
        <meta name="description" content={`View details for ${truck.name}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Navigation />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="mb-2">
              <EditableNameField 
                currentName={truck.name}
                onSave={handleUpdateName}
                vehicleType="truck"
              />
            </div>
            <p className="text-gray-600">Detailed information and package list</p>
          </motion.div>

          {/* Truck Overview Card */}
          <Card className="mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col items-center">
                <CircleProgress
                  percentage={percentage}
                  icon={Truck}
                  size={160}
                  primaryColor="#4d148c"
                />
                
                {/* Package Spinner Control */}
                <div className="flex items-center gap-4 mt-6 bg-gray-100 p-2 rounded-xl">
                  <button
                    onClick={handleDecrement}
                    disabled={packages.length === 0}
                    className="p-2 rounded-lg bg-white shadow-sm text-gray-600 hover:text-[#ff6600] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Remove package"
                  >
                    <Minus size={20} />
                  </button>
                  <div className="flex flex-col items-center w-20">
                    <span className="text-xl font-bold text-[#4d148c]">{packages.length}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Packages</span>
                  </div>
                  <button
                    onClick={handleIncrement}
                    disabled={packages.length >= truck.capacity}
                    className="p-2 rounded-lg bg-white shadow-sm text-gray-600 hover:text-[#4d148c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Add package"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Current Packages</p>
                    <p className="text-2xl font-bold text-gray-800">{packages.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Capacity</p>
                    <p className="text-2xl font-bold text-gray-800">{truck.capacity}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Available Space</p>
                    <p className="text-2xl font-bold text-gray-800">{truck.capacity - packages.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Utilization</p>
                    <p className="text-2xl font-bold text-gray-800">{Math.round(percentage)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Packages List */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Packages ({packages.length})</h3>
          </div>
          
          <div className="space-y-3">
            {uniquePackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div 
                  onClick={() => handlePackageClick(pkg.id)}
                  className="cursor-pointer group"
                >
                  <Card className="py-4 border-2 border-transparent hover:border-[#4d148c]/20 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#4d148c]/10 p-3 rounded-lg group-hover:bg-[#4d148c]/20 transition-colors">
                          <Package size={24} className="text-[#4d148c]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800">{pkg.id}</p>
                            <ExternalLink size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-sm text-gray-500">
                            {pkg.recipient_name ? pkg.recipient_name : 'No recipient set'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pkg.status)}`}>
                        {pkg.status}
                      </span>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
            {packages.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Package size={48} className="mx-auto mb-4 opacity-20" />
                <p>No packages in this truck yet.</p>
                <p className="text-sm">Use the controls above to add packages.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TruckDetail;
