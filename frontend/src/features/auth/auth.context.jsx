import { createContext, useState, useEffect } from "react";
import { fetchMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSetUser = async () => {
      const data = await fetchMe();
      setUser(data.user);
      setLoading(false);
    }
    getSetUser();
  }, [])

  return (
    <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
      { children }
    </AuthContext.Provider>
  )
}