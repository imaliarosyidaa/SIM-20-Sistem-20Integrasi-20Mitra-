// AuthProvider.tsx
import { createContext, useState } from 'react';

// The correct type should include username, password, and accessToken
type AuthContextType = {
  auth: {
    username: string | null;
    password?: string | null; // Optional if not always needed
    accessToken: string | null;
  };
  setAuth: React.Dispatch<React.SetStateAction<AuthContextType['auth']>>;
};

const AuthContext = createContext<AuthContextType>({
  auth: { username: null, accessToken: null },
  setAuth: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize with correct state structure
  const [auth, setAuth] = useState({ username: null, accessToken: null });
  
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;