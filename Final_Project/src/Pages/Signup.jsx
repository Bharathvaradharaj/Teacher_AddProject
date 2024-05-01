
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth"
import auth from "../config/firebase"
import { useEffect } from "react"
import axios from "axios"
import Data from "../ContexApi"

const Signup = () => {
    const [Suser, setSuser] = useState({
        name: "",
        roll: "",
        email: "",
        password: ""

    })

    const { setRegisterData } = useContext(Data)

    const [formValid, setFormValid] = useState(false);

    const navigate = useNavigate();


    const handlechange = (e) => {
        const { name, value } = e.target;

        setSuser((preve) => ({
            ...preve, [name]: value

        }))

    }



    const registerFormValidity = () => {
        const { name, roll, email, password } = Suser;
        if (name.trim() && roll.trim() && email.trim() && password.trim()) {
            setFormValid(true);
        } else {
            setFormValid(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        createUserWithEmailAndPassword(auth, Suser.email, Suser.password).then((res) => {

            console.log(res, "FireBase")
            console.log('Signup completed')
            navigate('/landing'); // Replace '/login' with your login page route
        }).catch((err) => {
            alert('email-already-in-use')
            console.log(err, "FireBase")

        })


        // Simulate user registration process
        // console.log('User registered:', { Suser });
        // After registration, redirect to the login page

        axios.post("https://teacher-add-project.vercel.app/api/register", Suser)
            .then(res => {
                if (res.status === 200) {
                    // Registration successful
                    alert(res.data.message)
                    // console.log(res.data.user._id, "Registered Data")
                    setRegisterData(prevState => ({ ...prevState, data: res.data.user, loaded: true }));
                    localStorage.setItem('registerData', JSON.stringify(res.data.user));
                } else {
                    // Handle other success status codes
                    console.log(res, "Else console response");
                }
            })
            .catch(err => {
                if (err.response && err.response.status === 400) {
                    // Email already registered
                    alert(err.response.data.message);

                    console.log(err.response.data.message, "catch err")
                } else {
                    // Handle other errors
                    console.error(err, "catch other err");
                    alert("An error occurred");
                }
            });
    };

    // useEffect(() => {

    //     window.scroll(0, 0)


    //     handleSubmit()

    // }, [])



    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form className="p-10 bg-white rounded-lg shadow-lg" style={{ width: "70%" }}>
                <h2 className="text-2xl font-bold mb-5 text-gray-800">Welcome to Sign Up page</h2>

                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="name">Name:</label>
                    <input
                        type="text"
                        value={Suser.name}
                        onChange={handlechange}
                        required
                        className="mt-1 p-2 w-full border rounded"
                        placeholder="Enter your Name"
                        name="name"
                        onBlur={registerFormValidity}

                    />
                </div>


                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="roll">Roll No:</label>
                    <input
                        type="text"
                        value={Suser.roll}
                        onChange={handlechange}
                        required
                        className="mt-1 p-2 w-full border rounded"
                        placeholder="Enter your Name"
                        name="roll"
                        onBlur={registerFormValidity}

                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="email">Email:</label>
                    <input
                        type="email"
                        value={Suser.email}
                        onChange={handlechange}
                        required
                        className="mt-1 p-2 w-full border rounded"
                        placeholder="Enter your Email ID"
                        name="email"
                        onBlur={registerFormValidity}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" htmlFor="password">Password:</label>
                    <input
                        type="password"
                        value={Suser.password}
                        onChange={handlechange}
                        required
                        className="mt-1 p-2 w-full border rounded"
                        placeholder="Enter your valid password"
                        name="password"
                        onBlur={registerFormValidity}
                    />
                </div>

                <p className='text-blue-600 cursor-pointer my-2' onClick={() => navigate("/")}> Already have an account? Login here</p>
                <button onClick={handleSubmit} type="submit" className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 ease-in-out  ${formValid ? '' : 'opacity-50 cursor-not-allowed'}`}
                    disabled={!formValid}
                >
                    Register
                </button>
            </form>
        </div>
    )
}

export default Signup
