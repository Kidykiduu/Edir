import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CHAPA_CONFIG } from '../config/chapaConfig';
import { ROLES } from '../config/roles';
import { apiCall } from '../utils/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [associations, setAssociations] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [resources, setResources] = useState([]);
  const [admins, setAdmins] = useState([]);

  // Load user from storage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // Login function
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiCall('url', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const data = await response.json();
        const userData = {
          username: data.username,
          email: data.email,
          roles: data.roles,
          isEdirHead: data.is_edir_head,
          verificationStatus: data.verification_status,
          edir: data.edir,
          hasCompletedRegistration: data.verification_status === 'approved',
        };
        await AsyncStorage.setItem('accessToken', data.access);
        await AsyncStorage.setItem('refreshToken', data.refresh);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error, please try again');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  // Token refresh function
  const refreshToken = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const refresh = await AsyncStorage.getItem('refreshToken');
      if (!refresh) throw new Error('No refresh token available');
      const response = await apiCall('url',{
        method: 'POST',
        body: JSON.stringify({ refresh }),
      });
      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('accessToken', data.access);
        return true;
      } else {
        await logout();
        return false;
      }
    } catch (err) {
      console.error('Token refresh error:', err);
      setError('Failed to refresh token');
      await logout();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize user during signup
  const initializeUser = (newUser) => {
    setUser({
      ...newUser,
      hasCompletedRegistration: false,
    });
  };

  // Complete registration after form submission
  const completeRegistration = () => {
    setUser((prev) => ({
      ...prev,
      hasCompletedRegistration: true,
    }));
  };

  // Payment processing
  const processPayment = async (paymentData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiCall(CHAPA_CONFIG.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          tx_ref: CHAPA_CONFIG.txRef(),
          currency: CHAPA_CONFIG.currency,
        }),
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to process payment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Task Management (Coordinator)
  const createTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now(), status: 'pending' }]);
  };

  const updateTask = (taskId, updates) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  // Payment Management (Money Collector)
  const recordPayment = (payment) => {
    setPayments([...payments, { 
      ...payment, 
      id: Date.now(),
      timestamp: new Date().toISOString() 
    }]);
  };

  // Resource Management (Resource Handler)
  const manageResource = (resource) => {
    setResources([...resources, {
      ...resource,
      id: Date.now(),
      status: 'available'
    }]);
  };

  // Admin Management (HeadOfEdir)
  const addAdmin = (admin) => {
    if (![ROLES.COORDINATOR, ROLES.MONEY_COLLECTOR, ROLES.RESOURCE_HANDLER].includes(admin.role)) {
      throw new Error('Invalid admin role');
    }
    setAdmins([...admins, admin]);
  };

  // Role checking
  const hasRole = (requiredRole) => user?.roles?.includes(requiredRole);
  const isHeadOfEdir = () => user?.isEdirHead;

  // Get admins under HeadOfEdir
  const getSubAdmins = () => {
    if (!isHeadOfEdir()) return [];
    return admins.filter(admin => 
      [ROLES.COORDINATOR, ROLES.MONEY_COLLECTOR, ROLES.RESOURCE_HANDLER].includes(admin.role)
    );
  };

  const value = {
    user,
    setUser,
    isLoading,
    error,
    associations,
    setAssociations,
    subscriptions,
    setSubscriptions,
    tasks,
    setTasks,
    payments,
    setPayments,
    resources,
    setResources,
    admins,
    setAdmins,
    login,
    logout,
    refreshToken,
    initializeUser,
    completeRegistration,
    processPayment,
    createTask,
    updateTask,
    recordPayment,
    manageResource,
    addAdmin,
    hasRole,
    isHeadOfEdir,
    getSubAdmins,
    ROLES
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};