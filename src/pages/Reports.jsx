
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Card from '@/components/Card';

const Reports = () => {
  return (
    <>
      <Helmet>
        <title>Reports - Fleet Manager</title>
        <meta name="description" content="View fleet analytics and reports" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Navigation />
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Reports</h2>
            <p className="text-gray-600">Analyze fleet performance and statistics</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-[#4d148c]/10 p-4 rounded-full mb-4">
                  <BarChart3 size={48} className="text-[#4d148c]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Reports Module</h3>
                <p className="text-gray-600 max-w-md">
                  Detailed analytics and reporting features are coming soon. 
                  You will be able to view historical data, efficiency metrics, and capacity trends here.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
