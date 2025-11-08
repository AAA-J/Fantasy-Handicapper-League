import React, { createContext, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    console.error('useUser must be used within a UserProvider');
    return { selectedUser: null, users: [], setSelectedUser: () => {} };
  }
  return context;
};

export const UserProvider = UserContext.Provider;
