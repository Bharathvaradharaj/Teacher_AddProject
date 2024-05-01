import { signInWithEmailAndPassword } from "firebase/auth";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../config/firebase";

import { useEffect } from "react";
import axios from "axios"
import Data from "../ContexApi";

const Login = () => {
    const navigate = useNavigate()
    const { setUserData, setaddProjectbtn } = useContext(Data)
    // const [loginClicked, setLoginClicked] = useState(false);
    const [Luser, setLuser] = useState({ email: "", password: "" })
    const [formValid, setFormValid] = useState(false);


    const handlechange = (e) => {

        const { name, value } = e.target;
        setLuser((preve) => ({
            ...preve, [name]: value

        }))
    }


    useEffect(() => {
        window.scroll(0, 0)
        auth.onAuthStateChanged(function (user) {
            if (user) {
                console.log('User Logged');
                navigate('/landing');
            } else {
                console.log("logout");

                navigate('/');
            }
        })

    }, [])


    const handleLogin = (e) => {
        e.preventDefault();

        axios.post("https://teacher-add-project.vercel.app/api/login", Luser)
            .then((res) => {
                if (res.status === 200) {
                    alert(res.data.message);
                    setUserData(prevState => ({ ...prevState, data: res.data.loginuser, loaded: true }));
                    // setUserData(res.data.loginuser);
                    localStorage.setItem('userData', JSON.stringify(res.data.loginuser));
                    // console.log(res.data.loginuser._id, "Login Data")



                } else if (res.status === 401) {
                    alert(res.data.message);
                }
            })
            .catch((err) => {
                console.error(err);
                alert("An error occurred");
            });



        signInWithEmailAndPassword(auth, Luser.email, Luser.password).then((res) => {
            // console.log(res)
            navigate('/landing');


        }).catch((err) => {
            console.log(err)
            alert('invalid-credential')
        })

        // Simulate login process
        // console.log('User logged in:', { Luser });



    }


    const loginFormValidity = () => {

        const { email, password } = Luser;
        if (email.trim() && password.trim()) {
            setFormValid(true);
        }else{
            setFormValid(false);
        }
    }


    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form className="p-10 bg-white rounded-lg shadow-md" style={{ width: "75%" }}>
                <h2 className="text-2xl font-bold mb-5 text-gray-800">Welcome to Login page</h2>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="email">Email:</label>
                    <input
                        type="email"
                        value={Luser.email}
                        onChange={handlechange}
                        required
                        className="mt-1 p-2 w-full border rounded"
                        placeholder="Enter your Email ID"
                        name="email"
                        onBlur={loginFormValidity}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="password">Password:</label>
                    <input
                        type="password"
                        value={Luser.password}
                        onChange={handlechange}
                        required
                        className="mt-1 p-2 w-full border rounded"
                        placeholder="Enter your valid password"
                        name="password"
                        onBlur={loginFormValidity}
                    />
                </div>
                <p className='text-blue-600 cursor-pointer my-2' onClick={() => navigate("/signup")}>New user? Register here</p>
                <button onClick={handleLogin} type="submit" className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-100  ${formValid ?" ":'opacity-50 cursor-not-allowed'}`}
                
                disabled={!formValid}>
                    Login
                </button>
            </form>
        </div>
    )




}

export default Login
