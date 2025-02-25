import React, { createContext,useState ,useEffect} from "react";
import { CognitoUser, AuthenticationDetails, CognitoUserSession, CognitoUserAttribute } from "amazon-cognito-identity-js";
import Pool from "../../UserPool";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export const AccountContext = createContext();

export const Account = (props) => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [user, setUser] = useState({});

    const getSession = async () => {
        return await new Promise((resolve,reject) => {
            const currentUser = Pool.getCurrentUser();
            if(currentUser){
              currentUser.getSession(async (err: Error | null, session: CognitoUserSession | null) => {
                    if(err || !session){
                        reject(err);
                    } else {
                        const attributes = await new Promise((resolve, reject) => {
                            currentUser.getUserAttributes((err, attributes) => {
                                if(err){
                                    reject(err);
                                } else {
                                    const results: Record<string, string> = {};

                                    for (let attribute of attributes) {
                                        const { Name, Value } = attribute;
                                        results[Name] = Value;
                                    }
                                    resolve(results);
                                }
                            });
                        });
                        const sessionData = { user: currentUser, ...session, ...attributes };
                        console.log("Session Data:", sessionData); 
                        resolve(sessionData);
                    }
                })
            } else {
              return reject(new Error("No current user"));  
            }
        })
    }

const authenticate = async (Username: string, Password: string) => {
    return new Promise((resolve, reject) => {
        const cognitoUser = new CognitoUser({
            Username: Username,
            Pool: Pool,
        });

        const authDetails = new AuthenticationDetails({
            Username: Username,
            Password: Password,
        });

        cognitoUser.authenticateUser(authDetails, {
            onSuccess: (data) => {
                console.log("Logged in!", data);
                resolve(data);

                // Extract token
                const token = data.getIdToken().getJwtToken();

                // Call backend separately (avoiding await in non-async function)
                axios.post("http://localhost:3000/api/login", {
                    email: Username,
                    token: token
                })
                .then((response) => {
                    setSuccessMessage("Login successful!");
                    setError("");
                    console.log("Server Response:", response.data);
                    setUser(response.data.user); // Set the user data from backend
                })
                .catch((err) => {
                    console.error("Login API Error:", err);
                    setError(err.response?.data?.detail || "Login failed");
                    setUser(null);
                });
            },
            onFailure: (err) => {
                console.error("Cognito Login Error:", err);
                setError(err.message || "Authentication failed");
                reject(err);
            }
        });
    });
};


    const logout = () => {
        const currentUser = Pool.getCurrentUser();
        if(currentUser){
          currentUser.signOut();
          setUser(null)
          navigate('/')
        }else {
            console.log("No user to log out."); 
            setUser(null); 
            navigate('/'); 
        }
    };

    return (
        <AccountContext.Provider 
          value={{authenticate,getSession,logout, user}}
        >
            {props.children}

        </AccountContext.Provider>
    )
}