import { json, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import './Navbar.css'
import { signOut } from "firebase/auth"
import auth from "../config/firebase"
import { useEffect } from "react"
import { useState } from "react"
import Data from "../ContexApi"
import { useContext } from "react"

const Navbar = ({ logout, setAddproject }) => {


    // const {  } = useContext(Data)

    const { addProjectbtn, setaddProjectbtn, setSearch, setProfile , profile } = useContext(Data)
    // const { userData, setUserData } = useContext(Data);
    const navigate = useNavigate();

    useEffect(() => {
        window.scroll(0, 0)

        const storedUserData = localStorage.getItem('userData');
        const registerUserData = localStorage.getItem('registerData');

        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            setUserData(userData);
            console.log(userData);
            if (userData._id === '662beed601d3735406bb3c70') {
                setaddProjectbtn(true);
            }
        } else if (registerUserData) {
            const registerData = JSON.parse(registerUserData);
            setRegisterData(registerData);
            if (registerData._id === '662beed601d3735406bb3c70') {
                setaddProjectbtn(true);
            }
        }

    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('registerData')
        setUserData(null);
        // navigate('/');
        logout()
    };

    const [showForm, setShowForm] = useState(true);

    const { setUserData, userData, setRegisterData, registerData } = useContext(Data)
    const toggleForm = () => {
        setShowForm(!showForm);
        setAddproject(!showForm);
        console.log(showForm)
    };


    function logout() {

        signOut(auth)
        setUserData(false)
        setRegisterData(false)
        navigate('/');
        setaddProjectbtn(false)
        console.log("logout")
        setSearch("")
    }

    const handleprofile = () => {

        setProfile(!profile)
    }

    return (

        <>
            <div>
                <h2 className="text-2xl font-bold mb-5 text-gray-800 p-10 w-fit">Welcome {(userData && userData.name) || (registerData && registerData.name)}</h2>
            </div>

            {addProjectbtn ?
                (< div className="flex gap-3 justify-center items-center mx-2">

                    <input
                        className="mt-1 px-2 py-3 w-96 border rounded-md border-black outline-none"
                        placeholder="Search Here"
                        type="search"
                        onChange={(e) => setSearch(e.target.value)}
                    >

                    </input>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-100 " >Search</button>
                </div >)
                : (<></>)
            }



            <div className="flex gap-6 px-2 ">
                {addProjectbtn ?

                    < button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-100 " onClick={toggleForm}>
                        Add Project
                    </button> : " "
                }

                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-100 " onClick={handleprofile}>

                    Project
                </button>

            </div >


            <div className="px-2">

                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-100 " onClick={handleLogout}>
                    Logout
                </button>
            </div>


        </>

    )
}



export default Navbar