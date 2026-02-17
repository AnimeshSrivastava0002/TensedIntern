import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, applicationsAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      fetchApplications();
    }
    setLoading(false);
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationsAPI.getAll({ sort: 'recent' });
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      setIsAuthenticated(true);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      await fetchApplications();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({ name, email, password });
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      setIsAuthenticated(true);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setApplications([]);
    setToken(null);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const addApplication = async (appData) => {
    try {
      const response = await applicationsAPI.create(appData);
      await fetchApplications();
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to add application'
      };
    }
  };

  const updateApplication = async (id, updates) => {
    try {
      await applicationsAPI.update(id, updates);
      await fetchApplications();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update application'
      };
    }
  };

  const deleteApplication = async (id) => {
    try {
      await applicationsAPI.delete(id);
      await fetchApplications();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete application'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        applications,
        loading,
        token,
        login,
        register,
        logout,
        addApplication,
        updateApplication,
        deleteApplication,
        fetchApplications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
