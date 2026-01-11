
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Truck, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '@/components/Card';
import CircleProgress from '@/components/CircleProgress';
import Navigation from '@/components/Navigation';
import AddVehicleModal from '@/components/AddVehicleModal';
import { storage } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';

const Trucks = () => {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTrucks();

    const unsubscribe = storage.subscribe(() => {
      loadTrucks();
    });

    return () => unsubscribe();
  }, []);

  const loadTrucks = () => {
    // Note: In a real app we might not want to set loading to true on every update to avoid flicker
    // but for this task it ensures we see fresh data
    const trucksData = storage.getTrucks();
    const trucksWithPackages = trucksData.map(truck => ({
      ...truck,
      packages: storage.getTruckPackages(truck.id)
    }));
    setTrucks(trucksWithPackages);
    setLoading(false);
  };

  const handleAddTruck = (data) => {
    storage.addTruck(data);
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
          <p className="mt-4 text-gray-600 font-medium">Loading trucks...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Trucks - Fleet Manager</title>
        <meta name="description" content="View all trucks and their package capacity" />
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Trucks</h2>
              <p className="text-gray-600">View and manage all trucks in your fleet</p>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#ff6600] text-white rounded-xl shadow-lg hover:bg-[#e55c00] transition-all transform hover:scale-105 font-bold"
            >
              <Plus size={20} />
              Add Truck
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trucks.map((truck, index) => {
              const percentage = (truck.packages.length / truck.capacity) * 100;
              
              return (
                <motion.div
                  key={`${truck.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card to={`/trucks/${truck.id}`}>
                    <div className="flex flex-col items-center">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{truck.name}</h3>
                      <CircleProgress
                        percentage={percentage}
                        icon={Truck}
                        size={100}
                        primaryColor="#4d148c"
                      />
                      <div className="mt-4 w-full">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Packages:</span>
                          <span className="font-semibold">{truck.packages.length}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Capacity:</span>
                          <span className="font-semibold">{truck.capacity}</span>
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
        onSave={handleAddTruck}
        type="Truck"
      />
    </>
  );
};

export default Trucks;
