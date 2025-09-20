import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthState = {
  isLoggedIn: boolean;
  isGuest: boolean;
  token: string | null;
};

type AuthContextType = {
  authState: AuthState;
  login: (token: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    isGuest: false,
    token: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    const guestFlag = localStorage.getItem('GUEST_MODE');
    
    if (token) {
      setAuthState({
        isLoggedIn: true,
        isGuest: false,
        token,
      });
    } else if (guestFlag === 'true') {
      setAuthState({
        isLoggedIn: false,
        isGuest: true,
        token: null,
      });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('ACCESS_TOKEN', token);
    localStorage.removeItem('GUEST_MODE');
    setAuthState({
      isLoggedIn: true,
      isGuest: false,
      token,
    });
  };

  const loginAsGuest = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.setItem('GUEST_MODE', 'true');
    setAuthState({
      isLoggedIn: false,
      isGuest: true,
      token: null,
    });
  };

  const logout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('GUEST_MODE');
    setAuthState({
      isLoggedIn: false,
      isGuest: false,
      token: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
