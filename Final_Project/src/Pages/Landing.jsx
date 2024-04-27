import Navbar from "../Components/Navbar"
import { useState } from "react";
import { signOut } from "firebase/auth"
import auth from "../config/firebase"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import Data from "../ContexApi";
import { useContext } from "react";
import Select from "react-select"
import axios from "axios";

const Landing = () => {


    const navigate = useNavigate()
    const [projects, setProjects] = useState([])

    const [getUsers, setgetUser] = useState([])
    const [status, setStatus] = useState(false)

    const [addproject, setAddproject] = useState(false)

    const { userData, registerData } = useContext(Data)


    // All input values store useState
    const [project, setProject] = useState({
        projectTitle: "",
        projectDesc: "",
        students: []

    })

    // Save dropdown values

    const select = (selectedOptions) => {
        setProject((prevProject) => ({
            ...prevProject,
            students: selectedOptions
        }))

    }

    // Click invite function and sent api

    const invite = () => {
        setStatus(true)
        
        axios.post("http://localhost:3001/api/invite", project).then((res) => {
            console.log(res)
            if (res.status === 200) {
                alert('Invited Successfully')
                window.location.reload();
                setStatus(false)
            } else {
                alert("Invited Got Failed")
            }
        }).catch((err) => {

            console.log(err)
        })
    }


    // Handle input values
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProject((prevProject) => ({
            ...prevProject,
            [name]: value
        }));

    };


    useEffect(() => {
        // Fetch userdata
        axios.get("http://localhost:3001/userdata")
            .then(response => {
                setgetUser(response.data);
            })
            .catch(err => console.log(err));

        // Perform POST request after delayTime

        const delayTime = 1000;
        setTimeout(() => {
            axios.post("http://localhost:3001/landing", userData || registerData)
                .then(project => {
                    console.log(userData || registerData);
                    setProjects(project.data);


                })
                .catch(err => {
                    console.log(err, "Projects not received");
                });

        }, delayTime)

        // Auth state change listener

        auth.onAuthStateChanged(function (user) {
            if (user) {
                console.log('User Logged');
                navigate('/landing');
            } else {
                console.log("logout");

                navigate('/');
            }
        });


    }, [userData, registerData]);



    // prevent form function
    const handleform = (e) => {

        e.preventDefault();
        invite()
    }

    return (
        <>

            <div className="flex  justify-between items-center h-auto bg-gray-100 sm:w-auto md:w-auto  flex-wrap">


                <Navbar setAddproject={setAddproject}></Navbar>

            </div>
            {
                addproject &&
                <div className="flex  flex-col justify-between items-center h-auto bg-gray-100 " >
                    <h2 className="text-center text-5xl font-bold mb-14">Add  <span className='text-blue-400'>Projects</span></h2>


                    <div className="blog-creation-form mb-8" style={{ width: "80%", margin: "auto" }}>
                        <form onSubmit={handleform} className="flex flex-col gap-4">
                            <label className="block text-gray-700 text-4xl">Project Title</label>
                            <input
                                type="text"
                                placeholder="Project Title"
                                value={project.projectTitle}
                                onChange={handleInputChange}
                                className="p-2 border rounded"
                                required
                                name="projectTitle"
                            />

                            <label className="block text-gray-700 text-2xl">Project Description</label>
                            <textarea
                                placeholder="Project Description"
                                value={project.projectDesc}
                                onChange={handleInputChange}
                                className="p-2 border rounded"
                                rows="4"
                                required
                                name="projectDesc"
                            />
                            <label className="block text-gray-700 text-4xl"> Select Students</label>
                            <Select

                                options={getUsers.map(option => ({ value: option.email, label: `${option.name} (${option.roll})` }))}

                                values={project.students}
                                onChange={select}
                                isMulti={true}
                                name="students"
                            />


                            <button type="submit" className="bg-blue-400 text-white p-2 rounded hover:bg-blue-600" >
                                {status ? "Invited" : "Invite"}
                            </button>
                        </form>
                    </div>
                </div>
            }

            <div className="blogs-container grid grid-cols-1 md:grid-cols-2 gap-6 container mx-auto px-4 mt-6">
                {projects.map(project => (
                    <div key={project._id} className="blog-post mb-8 p-6 bg-white shadow-lg rounded-lg">
                        <h3 className="blog-title font-semibold text-2xl text-gray-800 mb-3">{project.projectTitle}</h3>
                        <div>
                            {project.students.map((student, index) => (
                                <div key={index} className="student-info">
                                    <h4 className="student-label text-2xl">Student: {student.label}</h4>
                                    {/* <p className="student-email">{student.value}</p> */}
                                </div>
                            ))}
                        </div>
                        <p className="blog-date text-gray-400  mb-4 text-4xl"></p>
                        <p className="blog-content text-gray-600 mb-4 text-xl">{project.projectDesc}</p>
                    </div>
                ))}
            </div>

        </>
    )
}




export default Landing

