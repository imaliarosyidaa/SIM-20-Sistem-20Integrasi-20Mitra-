import { createContext, useState } from 'react';

type AuthContextType = {
  auth: {
    username: string | null;
    password?: string | null;
    accessToken: string | null;
    roles: string[] | null;
  };
  setAuth: React.Dispatch<React.SetStateAction<AuthContextType['auth']>>;
};

const AuthContext = createContext<AuthContextType>({
  auth: { username: null, accessToken: null, roles: null },
  setAuth: () => { }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState({ username: null, accessToken: null, roles: null });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;