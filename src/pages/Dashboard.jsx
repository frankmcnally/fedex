
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Building2, Truck, Car as Van } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '@/components/Card';
import CircleProgress from '@/components/CircleProgress';
import Navigation from '@/components/Navigation';
import { storage } from '@/lib/storage';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load
    loadStats();

    // Set up subscription for real-time updates
    const unsubscribe = storage.subscribe(() => {
      loadStats();
    });

    return () => unsubscribe();
  }, []);

  const loadStats = () => {
    // We can remove the artificial delay here since local storage is fast enough
    // and we want instant feedback when adding items
    const data = storage.getStats();
    setStats(data);
    setLoading(false);
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#4d148c] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate percentages safely to avoid NaN if capacity is 0
  const totalPercentage = stats.totalCapacity > 0 
    ? (stats.totalPackages / stats.totalCapacity) * 100 
    : 0;
  
  const truckPercentage = stats.truckCapacity > 0
    ? (stats.truckPackages / stats.truckCapacity) * 100
    : 0;
    
  const vanPercentage = stats.vanCapacity > 0
    ? (stats.vanPackages / stats.vanCapacity) * 100
    : 0;

  return (
    <>
      <Helmet>
        <title>Dashboard - Fleet Manager</title>
        <meta name="description" content="Fleet management dashboard showing trucks, vans, and package statistics" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Navigation />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Fleet Overview</h2>
            <p className="text-gray-600">Monitor your fleet capacity and package distribution</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Capacity Card */}
            <Card to="/">
              <div className="flex flex-col items-center">
                <CircleProgress
                  percentage={totalPercentage}
                  icon={Building2}
                  label="Total Capacity"
                  primaryColor="#4d148c"
                />
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    {stats.totalPackages} / {stats.totalCapacity} packages
                  </p>
                </div>
              </div>
            </Card>

            {/* Trucks Card */}
            <Card to="/trucks">
              <div className="flex flex-col items-center">
                <CircleProgress
                  percentage={truckPercentage}
                  icon={Truck}
                  label="Trucks"
                  primaryColor="#4d148c"
                />
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    {stats.truckPackages} / {stats.truckCapacity} packages
                  </p>
                </div>
              </div>
            </Card>

            {/* Vans Card */}
            <Card to="/vans">
              <div className="flex flex-col items-center">
                <CircleProgress
                  percentage={vanPercentage}
                  icon={Van}
                  label="Vans"
                  primaryColor="#4d148c"
                />
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    {stats.vanPackages} / {stats.vanCapacity} packages
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
