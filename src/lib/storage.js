
import React from 'react';

// Initialize localStorage with seed data if empty
const initializeData = () => {
  const trucks = localStorage.getItem('trucks');
  const vans = localStorage.getItem('vans');
  const packages = localStorage.getItem('packages');

  if (!trucks || !vans || !packages) {
    // Create 5 trucks
    const trucksData = Array.from({ length: 5 }, (_, i) => ({
      id: `truck-${i + 1}`,
      name: `Truck ${i + 1}`,
      capacity: 100,
      created_at: new Date().toISOString()
    }));

    // Create 5 vans
    const vansData = Array.from({ length: 5 }, (_, i) => ({
      id: `van-${i + 1}`,
      name: `Van ${i + 1}`,
      capacity: 50,
      created_at: new Date().toISOString()
    }));

    // Create 200+ packages distributed across trucks and vans
    const packagesData = [];
    let packageId = 1;

    // Distribute packages to trucks (120 packages total)
    trucksData.forEach((truck, index) => {
      const packagesForTruck = 24; // 24 packages per truck = 120 total
      for (let i = 0; i < packagesForTruck; i++) {
        packagesData.push({
          id: `pkg-${packageId++}`,
          truck_id: truck.id,
          van_id: null,
          status: ['pending', 'in-transit', 'delivered'][Math.floor(Math.random() * 3)],
          recipient_name: `Recipient ${packageId}`,
          address_1: `${Math.floor(Math.random() * 999) + 1} Logistics Blvd`,
          address_2: '',
          city: 'Memphis',
          state: 'TN',
          zip: '38120',
          created_at: new Date().toISOString()
        });
      }
    });

    // Distribute packages to vans (100 packages total)
    vansData.forEach((van, index) => {
      const packagesForVan = 20; // 20 packages per van = 100 total
      for (let i = 0; i < packagesForVan; i++) {
        packagesData.push({
          id: `pkg-${packageId++}`,
          truck_id: null,
          van_id: van.id,
          status: ['pending', 'in-transit', 'delivered'][Math.floor(Math.random() * 3)],
          recipient_name: `Recipient ${packageId}`,
          address_1: `${Math.floor(Math.random() * 999) + 1} Delivery Ln`,
          address_2: `Apt ${Math.floor(Math.random() * 20) + 1}`,
          city: 'Los Angeles',
          state: 'CA',
          zip: '90001',
          created_at: new Date().toISOString()
        });
      }
    });

    localStorage.setItem('trucks', JSON.stringify(trucksData));
    localStorage.setItem('vans', JSON.stringify(vansData));
    localStorage.setItem('packages', JSON.stringify(packagesData));
  }
};

// Initialize data on module load
initializeData();

// Helper to notify subscribers in the same tab
const notifySubscribers = () => {
  window.dispatchEvent(new Event('local-storage-update'));
};

// Helper to generate packages for new vehicles
const generateInitialPackages = (count, vehicleId, type) => {
  const newPackages = [];
  for (let i = 0; i < count; i++) {
    newPackages.push({
      id: `pkg-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      truck_id: type === 'truck' ? vehicleId : null,
      van_id: type === 'van' ? vehicleId : null,
      status: 'pending',
      recipient_name: 'New Recipient',
      address_1: '123 New St',
      address_2: '',
      city: 'City',
      state: 'ST',
      zip: '00000',
      created_at: new Date().toISOString()
    });
  }
  return newPackages;
};

// Storage API
export const storage = {
  // Get all trucks
  getTrucks: () => {
    const trucks = localStorage.getItem('trucks');
    return trucks ? JSON.parse(trucks) : [];
  },

  // Get single truck
  getTruck: (id) => {
    const trucks = storage.getTrucks();
    return trucks.find(t => t.id === id);
  },

  // Add new truck
  addTruck: ({ name, capacity, currentPackages }) => {
    const trucks = storage.getTrucks();
    const newTruck = {
      id: `truck-${Date.now()}`,
      name,
      capacity: parseInt(capacity),
      created_at: new Date().toISOString()
    };
    
    trucks.push(newTruck);
    localStorage.setItem('trucks', JSON.stringify(trucks));

    // Handle initial packages if any
    if (currentPackages > 0) {
      const allPackages = storage.getPackages();
      const newPackages = generateInitialPackages(currentPackages, newTruck.id, 'truck');
      localStorage.setItem('packages', JSON.stringify([...allPackages, ...newPackages]));
    }

    notifySubscribers();
    return newTruck;
  },

  // Update truck name
  updateTruckName: (id, newName) => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      return { success: false, error: "Name cannot be empty" };
    }

    const trucks = storage.getTrucks();
    // Check for duplicates (excluding current truck)
    const duplicate = trucks.find(t => t.name.toLowerCase() === trimmedName.toLowerCase() && t.id !== id);
    
    if (duplicate) {
      return { success: false, error: "Name already exists" };
    }

    const truckIndex = trucks.findIndex(t => t.id === id);
    if (truckIndex === -1) {
      return { success: false, error: "Truck not found" };
    }

    trucks[truckIndex].name = trimmedName;
    localStorage.setItem('trucks', JSON.stringify(trucks));
    notifySubscribers();
    return { success: true, truck: trucks[truckIndex] };
  },

  // Get all vans
  getVans: () => {
    const vans = localStorage.getItem('vans');
    return vans ? JSON.parse(vans) : [];
  },

  // Get single van
  getVan: (id) => {
    const vans = storage.getVans();
    return vans.find(v => v.id === id);
  },

  // Add new van
  addVan: ({ name, capacity, currentPackages }) => {
    const vans = storage.getVans();
    const newVan = {
      id: `van-${Date.now()}`,
      name,
      capacity: parseInt(capacity),
      created_at: new Date().toISOString()
    };
    
    vans.push(newVan);
    localStorage.setItem('vans', JSON.stringify(vans));

    // Handle initial packages if any
    if (currentPackages > 0) {
      const allPackages = storage.getPackages();
      const newPackages = generateInitialPackages(currentPackages, newVan.id, 'van');
      localStorage.setItem('packages', JSON.stringify([...allPackages, ...newPackages]));
    }

    notifySubscribers();
    return newVan;
  },

  // Update van name
  updateVanName: (id, newName) => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      return { success: false, error: "Name cannot be empty" };
    }

    const vans = storage.getVans();
    // Check for duplicates (excluding current van)
    const duplicate = vans.find(v => v.name.toLowerCase() === trimmedName.toLowerCase() && v.id !== id);
    
    if (duplicate) {
      return { success: false, error: "Name already exists" };
    }

    const vanIndex = vans.findIndex(v => v.id === id);
    if (vanIndex === -1) {
      return { success: false, error: "Van not found" };
    }

    vans[vanIndex].name = trimmedName;
    localStorage.setItem('vans', JSON.stringify(vans));
    notifySubscribers();
    return { success: true, van: vans[vanIndex] };
  },

  // Get all packages
  getPackages: () => {
    const packages = localStorage.getItem('packages');
    return packages ? JSON.parse(packages) : [];
  },

  // Get packages for a truck
  getTruckPackages: (truckId) => {
    const packages = storage.getPackages();
    return packages.filter(p => p.truck_id === truckId);
  },

  // Get packages for a van
  getVanPackages: (vanId) => {
    const packages = storage.getPackages();
    return packages.filter(p => p.van_id === vanId);
  },

  // Add a new package
  addPackage: ({ truck_id, van_id }) => {
    const packages = storage.getPackages();
    const newPackage = {
      id: `pkg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      truck_id: truck_id || null,
      van_id: van_id || null,
      status: 'pending',
      recipient_name: 'New Recipient',
      address_1: 'TBD',
      address_2: '',
      city: 'TBD',
      state: 'TBD',
      zip: '00000',
      created_at: new Date().toISOString()
    };
    packages.push(newPackage);
    localStorage.setItem('packages', JSON.stringify(packages));
    notifySubscribers();
    return newPackage;
  },

  // Remove a package (removes the last one added to that vehicle)
  removePackage: ({ truck_id, van_id }) => {
    let packages = storage.getPackages();
    // Find the last package for this vehicle to remove (LIFO for simplicity in this demo)
    const index = packages.findLastIndex(p => 
      (truck_id && p.truck_id === truck_id) || (van_id && p.van_id === van_id)
    );
    
    if (index !== -1) {
      packages.splice(index, 1);
      localStorage.setItem('packages', JSON.stringify(packages));
      notifySubscribers();
      return true;
    }
    return false;
  },

  // Update Package Recipient
  updatePackageRecipient: (packageId, recipientName) => {
    const packages = storage.getPackages();
    const index = packages.findIndex(p => p.id === packageId);
    
    if (index === -1) {
      return { success: false, error: "Package not found" };
    }

    packages[index].recipient_name = recipientName;
    localStorage.setItem('packages', JSON.stringify(packages));
    notifySubscribers();
    return { success: true };
  },

  // Update Package Address
  updatePackageAddress: (packageId, addressData) => {
    const packages = storage.getPackages();
    const index = packages.findIndex(p => p.id === packageId);

    if (index === -1) {
      return { success: false, error: "Package not found" };
    }

    // Merge existing package with new address fields
    packages[index] = { ...packages[index], ...addressData };
    
    localStorage.setItem('packages', JSON.stringify(packages));
    notifySubscribers();
    return { success: true };
  },

  // Get packages by vehicle type
  getPackagesByVehicleType: (type) => {
    const packages = storage.getPackages();
    if (type === 'truck') {
      return packages.filter(p => p.truck_id !== null && p.truck_id !== undefined);
    } else if (type === 'van') {
      return packages.filter(p => p.van_id !== null && p.van_id !== undefined);
    }
    return [];
  },

  // Get statistics
  getStats: () => {
    const trucks = storage.getTrucks();
    const vans = storage.getVans();
    const packages = storage.getPackages();

    const totalTruckCapacity = trucks.reduce((sum, t) => sum + t.capacity, 0);
    const totalVanCapacity = vans.reduce((sum, v) => sum + v.capacity, 0);
    const totalTruckPackages = packages.filter(p => p.truck_id).length;
    const totalVanPackages = packages.filter(p => p.van_id).length;

    return {
      totalCapacity: totalTruckCapacity + totalVanCapacity,
      totalPackages: totalTruckPackages + totalVanPackages,
      truckCapacity: totalTruckCapacity,
      truckPackages: totalTruckPackages,
      vanCapacity: totalVanCapacity,
      vanPackages: totalVanPackages
    };
  },

  // Subscribe to changes (supports both cross-tab and local updates)
  subscribe: (callback) => {
    const handler = () => callback();
    
    // Listen for storage events (cross-tab)
    window.addEventListener('storage', handler);
    // Listen for local events (same-tab)
    window.addEventListener('local-storage-update', handler);
    
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('local-storage-update', handler);
    };
  }
};
