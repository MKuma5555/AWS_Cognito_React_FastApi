
import React, {useState,useContext,useEffect} from "react";
import { AccountContext } from "./Account"
import mainLogo from '../../assets/images/logo_main.png'
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    const { authenticate } = useContext(AccountContext);


    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        authenticate(email,password)
            .then(data => {
                console.log("Logged in !", data)
                setSuccessMessage("Login successful! Hello",);
                navigate('/topPage')
                setError("");
            })
            .catch(err => {
                console.log("Failed to login", err)
                setError(err.message);
                setSuccessMessage("")
            })

    };



    return (
        <>
        
            <div className="h-screen flex">
            <div className="flex w-1/2 justify-around items-center">
                <div className="w-3/5">
                    <img src={mainLogo} alt="Denso parlor Logo"/>
                </div>
            </div>
            <div className="flex w-1/2 justify-center items-center bg-white">
            <form className="bg-white" onSubmit={onSubmit} >
                <h1 className="text-gray-800 font-bold text-2xl mb-7 text-center">ログイン</h1>

                <p className="text-sm font-normal text-gray-600 mb-3">メールアドレス</p>
                <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
                </svg>

                
                <input
                className="pl-2 outline-none border-none"
                type="email"
                name="email"
                id="login-email"
                autoComplete="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>


                <p className="text-sm font-normal text-gray-600 mb-3">パスワード</p>
                <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    >
                    <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                    />
                    </svg>
                
                    <input
                    type="password"
                    name="password"
                    id="login-password"
                    autoComplete="current-password"
                    required
                    className="pl-2 outline-none border-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
            </div>
            <button type="submit" className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">
                Login
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    
            <span className="text-sm ml-2 hover:text-blue-500 cursor-pointer text-center">パスワードをお忘れの方 ?</span><br/>
            </form>
        </div>
        </div>
        </>
    )
 
}

export default Login