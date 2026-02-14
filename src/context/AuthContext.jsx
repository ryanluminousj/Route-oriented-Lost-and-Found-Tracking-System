import { createContext, useContext, useState } from 'react';

// Create the auth context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(userData) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
  }

  function signup(userData) {
    setUser(userData);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
