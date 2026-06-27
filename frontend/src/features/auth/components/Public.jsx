import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import Loader from "../../../components/Loader";

const Public = ({ children }) => {
    const { loading, user } = useAuth();

    if(loading) return <Loader fullScreen={true} text="Loading..." />;

    if(user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default Public;
