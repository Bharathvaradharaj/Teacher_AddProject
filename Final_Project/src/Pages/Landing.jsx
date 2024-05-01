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
import { MdClose } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
const Landing = () => {

    const location = useLocation()



    const { userData, registerData, search, profile, setProfile, setRegisterData } = useContext(Data)
    const [deletebtn, setDelete] = useState()

    const [editForm, setEditForm] = useState({
        name: userData.name || registerData.name || "",
        roll: userData.roll || registerData.roll || "",
        email: userData.email || registerData.email || "",
    });


    const handleformvalue = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    // console.log(editForm)
    const navigate = useNavigate()
    const [projects, setProjects] = useState([])

    const [getUsers, setgetUser] = useState([])
    const [status, setStatus] = useState(true)

    const [addproject, setAddproject] = useState(false)

    const [showProject, setShowProject] = useState(true)

    const [isEditable, setIsEditable] = useState(false);





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


        axios.post("https://teacher-add-project.vercel.app/api/invite", project).then((res) => {
            // console.log(res)
            if (res.status === 200) {
                alert('Invited Successfully')
                window.location.reload();
                setStatus(true)
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

    const handleEditForm = () => {
        setIsEditable(true)
    }




    useEffect(() => {
        window.scroll(0, 0)
        // console.log(location)
        onDeleteButtonClick()

        setEditForm({
            name: userData.name || registerData.name || "",
            roll: userData.roll || registerData.roll || "",
            email: userData.email || registerData.email || "",
        });

        // Fetch userdata
        axios.get("https://teacher-add-project.vercel.app/userdata")
            .then(response => {
                setgetUser(response.data);
            })
            .catch(err => console.log(err));

        // Perform POST request after delayTime

        const delayTime = 1000;
        setTimeout(() => {

            axios.post("https://teacher-add-project.vercel.app/landing", userData || registerData)
                .then(project => {
                    //    console .log(userData || registerData);
                    setProjects(project.data);
                    console.log(project)

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


    const sendData = {
        editForm: editForm,
        userData: userData || registerData
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setIsEditable(false)


        axios.post("https://teacher-add-project.vercel.app/submitData", sendData)
            .then(res => {
                // console.log(res, 'Success');
                alert("Details Changed Successfully");
                setIsEditable(false); // Set isEditable to false to make the fields non-editable again
                setTimeout(() => {
                    // window.location.reload();
                }, 1000);
                console.log(res.data)
                const updatedDocument = res.data.updatedDocument;

                // Update userData and registerData
                const userDataString = localStorage.getItem('userData');
                const userData = userDataString ? JSON.parse(userDataString) : {};
                userData.name = updatedDocument.name;
                userData.roll = updatedDocument.roll;
                userData.email = updatedDocument.email;
                userData._id = updatedDocument._id;

                localStorage.setItem('userData', JSON.stringify(userData));

                const registerDataString = localStorage.getItem('registerData');
                const registerData = registerDataString ? JSON.parse(registerDataString) : {};
                registerData.name = updatedDocument.name;
                registerData.roll = updatedDocument.roll;
                registerData.email = updatedDocument.email;
                registerData._id = updatedDocument._id;
                localStorage.setItem('registerData', JSON.stringify(registerData));

                console.log(updatedDocument, "Got it");
            })
            .catch((err) => {
                console.log(err, 'Error');
                alert("An error occurred");
            });




    };




    // prevent form function
    const handleform = (e) => {

        e.preventDefault();
        setStatus(false);
        invite()
    }

    const handleProfile = (e) => {

        e.preventDefault()

    }

    const onDeleteButtonClick = () => {
        if (userData.email === "bharathsara788@gmail.com" || registerData.email === "bharathsara788@gmail.com") {
            setDelete(true);
        } else {
            setDelete(false);
        }
    };



    const handleDelete = async (projectId, project) => {
        console.log(project)


        try {
            const response = await axios.delete("https://teacher-add-project.vercel.app/delete", { data: { _id: projectId, fproject: project } });
            console.log(response.data, "Data Deleted Successfully");
            alert("Project Deleted Succesfully")
            window.location.reload();
            // Handle any additional logic after successful deletion
        } catch (error) {
            console.error("Error deleting data:", error);
            // Handle error scenarios
        }
    };




    if (profile) {
        document.body.style.overflowY = 'hidden';
    } else {
        document.body.style.overflowY = 'display';
    }





    return (
        <div>

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


                            <button type="submit" className={`bg-blue-400 text-white p-2 rounded hover:bg-blue-600 ${!status && 'opacity-50 pointer-events-none'}`} disabled={!status}>
                                {status ? "Invite" : "Invited"}
                            </button>
                        </form>
                    </div>
                </div>
            }



            {profile ?
                <div className="flex  justify-center items-center  h-auto bg-gray-100 sm:w-auto md:w-autpo mx-auto flex-wrap py-5 px-10 my-2 fixed top-0 bottom-0" style={{ background: 'rgba(49, 49, 49, 0.8)', width: "100vw" }}>

                    <form onChange={handleProfile} className="flex flex-col gap-4">
                        <button className="text-white top-10 right-10" style={{ position: "absolute" }} onClick={(e) => setProfile(false)}><MdClose></MdClose></button>
                        <label className="block text-white text-2xl">Name</label>
                        <input
                            type="text"

                            name="name"
                            onChange={handleformvalue}
                            className="p-2 border rounded w-96"
                            required
                            value={editForm.name}
                            defaultValue={userData.name || registerData.name}

                            onClick={handleEditForm}

                        />

                        <label className="block text-white text-2xl">Roll No</label>
                        <input
                            type="text"

                            name="roll"
                            className="p-2 border rounded"
                            required
                            value={editForm.roll}
                            defaultValue={userData.roll || registerData.roll}
                            onChange={handleformvalue}
                            onClick={handleEditForm}

                        />
                        <label className="block text-white text-2xl">Email</label>
                        <input
                            type="text"

                            name="email"
                            className="p-2 border rounded"
                            required
                            defaultValue={userData.email || registerData.email}
                            onChange={handleformvalue}
                            // defaultValue={userData.email}
                            value={editForm.email}
                            disabled
                        />

                        <button type="submit" className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-100 ${!isEditable && 'opacity-50 pointer-events-none'}`} onClick={handleSubmit} disabled={!isEditable}>Submit</button>

                    </form>

                </div> : ""
            }



            < div className="blogs-container grid grid-cols-1 md:grid-cols-2 gap-6 container mx-auto px-4 mt-6">
                {projects.filter(project =>
                    project.projectTitle.toLowerCase().includes(search.toLowerCase())
                    || project.projectDesc.toLowerCase().includes(search.toLowerCase())
                    || project.students.some(student => student.label.toLowerCase().includes(search.toLowerCase()))).map(project => (
                        <div key={project._id} className="blog-post mb-8 p-6 bg-white shadow-lg rounded-lg">
                            <h3 className="blog-title font-semibold text-2xl text-gray-800 mb-3">{project.projectTitle}</h3>
                            <div>
                                {project.students.map((student, index) => (
                                    <div key={index} className="student-info">
                                        <h4 className="student-label text-2xl">Student: {student.label}</h4>
                                        <p className="student-email">{student.value}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="blog-date text-gray-400  mb-4 text-4xl"></p>
                            <p className="blog-content text-gray-600 mb-4 text-xl">{project.projectDesc}</p>
                            {deletebtn ?
                                <MdDelete style={{ color: "red" }} className="size-6" onClick={(e) => handleDelete(project._id, project)}></MdDelete> : ""
                            }
                        </div>
                    ))}
            </div>


        </div >
    )
}




export default Landing
