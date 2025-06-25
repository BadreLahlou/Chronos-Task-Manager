
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type UserRoleContextType = {
  userRole: string | null;
  setUserRole: (role: string) => void;
  clearUserRole: () => void;
  isRoleLoaded: boolean;
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRoleState] = useState<string | null>(null);
  const [isRoleLoaded, setIsRoleLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user role from localStorage on initial render
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setUserRoleState(storedRole);
    }
    setIsRoleLoaded(true);
  }, []);

  const setUserRole = (role: string) => {
    setUserRoleState(role);
    localStorage.setItem('userRole', role);
  };

  const clearUserRole = () => {
    setUserRoleState(null);
    localStorage.removeItem('userRole');
    navigate('/role-selection');
  };

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole, clearUserRole, isRoleLoaded }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
