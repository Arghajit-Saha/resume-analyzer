import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, googleVerify, googleRegister } from "../services/auth.api"

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

    const handleGoogleVerify = async (credential) => {
        setLoading(true);
        const res = await googleVerify({ credential });
        if (res.status === 200 && res.data.user) {
            setUser(res.data.user);
        }
        setLoading(false);
        return res;
    }

    const handleGoogleRegister = async (registrationToken, password) => {
        setLoading(true);
        const data = await googleRegister({ registrationToken, password });
        setUser(data.user);
        setLoading(false);
    }

    return { user, loading, handleLogin, handleRegister, handleLogout, handleGoogleVerify, handleGoogleRegister };
}