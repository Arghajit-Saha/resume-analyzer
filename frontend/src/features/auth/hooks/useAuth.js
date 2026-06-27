import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api"

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;
    
    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        const data = await login({ email, password });
        setUser(data.user);
        setLoading(false);
    }

    const handleRegister = async ({ firstName, lastName, email, password }) => {
        setLoading(true);
        const data = await register({ firstName, lastName, email, password });
        setUser(data.user);
        setLoading(false);
    }

    const handleLogout = async () => {
        setLoading(true);
        await logout();
        setUser(null);
        setLoading(false);
    }

    return { user, loading, handleLogin, handleRegister, handleLogout };
}