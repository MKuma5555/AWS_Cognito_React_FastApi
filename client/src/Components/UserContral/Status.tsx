import React, { useState, useContext, useEffect } from "react";
import { AccountContext } from "./Account";
import { useNavigate } from "react-router-dom";
import TopPage from "../TopPage";
import axios from "axios";
import Login from "./Login"

const Status: React.FC = () => {
    const navigate = useNavigate();

    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(true);
    const { getSession,logout } = useContext(AccountContext);

    useEffect(() => {
        getSession().then(async (session) => {
                console.log("Cognito session: ",session);
                const email = session.idToken.payload.email;

                // Check if user exists in the database
                try {
                    const response = await axios.post("http://localhost:3000/api/login", { email });
                    if (response.data.exists) {
                        setStatus(true);
                        navigate("/topPage");
                    } else {
                        navigate("/");
                    }
                } catch (error) {
                    console.error("Database check failed:", error);
                    navigate("/");
                }
            })
            .catch(() => {
                navigate("/");
            })
            .finally(() => setLoading(false));
    }, []);
            
    if (loading) return <p>Checking authentication...</p>;

    return (
        <div style={{ fontSize: "24px" }}>
        {status ? (
            <button onClick={logout}>Logout</button>
        ) : (
            <Login />
        )}
    </div>
    )

};
export default Status;;