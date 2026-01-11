
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Car as Van, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '@/components/Card';
import CircleProgress from '@/components/CircleProgress';
import Navigation from '@/components/Navigation';
import AddVehicleModal from '@/components/AddVehicleModal';
import { storage } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';

const Vans = () => {
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadVans();

    const unsubscribe = storage.subscribe(() => {
      loadVans();
    });

    return () => unsubscribe();
  }, []);

  const loadVans = () => {
    const vansData = storage.getVans();
    const vansWithPackages = vansData.map(van => ({
      ...van,
      packages: storage.getVanPackages(van.id)
    }));
    setVans(vansWithPackages);
    setLoading(false);
  };

  const handleAddVan = (data) => {
    storage.addVan(data);
    toast({
      title: "Success",
      description: `${data.name} has been added to the fleet.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#4d148c] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading vans...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Vans - Fleet Manager</title>
        <meta name="description" content="View all vans and their package capacity" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Navigation />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Vans</h2>
              <p className="text-gray-600">View and manage all vans in your fleet</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#ff6600] text-white rounded-xl shadow-lg hover:bg-[#e55c00] transition-all transform hover:scale-105 font-bold"
            >
              <Plus size={20} />
              Add Van
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vans.map((van, index) => {
              const percentage = (van.packages.length / van.capacity) * 100;
              
              return (
                <motion.div
                  key={`${van.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card to={`/vans/${van.id}`}>
                    <div className="flex flex-col items-center">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{van.name}</h3>
                      <CircleProgress
                        percentage={percentage}
                        icon={Van}
                        size={100}
                        primaryColor="#4d148c"
                      />
                      <div className="mt-4 w-full">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Packages:</span>
                          <span className="font-semibold">{van.packages.length}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Capacity:</span>
                          <span className="font-semibold">{van.capacity}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddVan}
        type="Van"
      />
    </>
  );
};

export default Vans;
