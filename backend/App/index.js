const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(cors(

    {
        origin: ["https://deploy-mern-frontend.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
))




const nodemailer = require("nodemailer");




/*===================== mongoose setup===============*/

mongoose.connect("mongodb+srv://bharathsara788:vrdXPAZTjWb3R3KM@cluster0.wvz6pnd.mongodb.net/registerData?retryWrites=true&w=majority&appName=Cluster0", {

    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {

    console.log('DB is  connected')
}).catch(() => {

    console.log('DB is not connected')
})


/*=========Create Schema=======*/

const { Schema } = mongoose;

const registerSchema = new Schema({
    name: String,
    roll: Number,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    project: [{
        projectTitle: String,
        projectDesc: String,
    }]



})

const ProjectSchema = new Schema({
    projectTitle: String,
    projectDesc: String,
    students: [{
        value: String,
        label: String
    }]
});


const mailSchema = new Schema({

    email: String,
    password: String
})





// const {}

/*==================Create Model==============*/



const registerDeatils = new mongoose.model('registerDeatils', registerSchema)

// const projectSchema = new mongoose.model('projectSchema', ProjectSchema)
const ProjectModels = new mongoose.model('ProjectModels', ProjectSchema);

const mailData = new mongoose.model('mailData', mailSchema)





/*================ Register User API==================*/


app.get("/", (req, res) => {
    res.json("Connected");
})


app.post('/api/register', async (req, res) => {
    console.log(req.body, "Register Data")
    // res.send({ message: "This email already register" })
    const { name, roll, email, password } = req.body;
    try {
        const existingUser = await registerDeatils.findOne({ email: email });
        if (existingUser) {
            res.status(400).send({ message: "This email is already registered" });
        } else {
            const newUser = new registerDeatils({
                name,
                roll,
                email,
                password
            });
            await newUser.save();
            res.send({ message: "New user created", user: newUser });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }


})



/*================ Login User API=================*/


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const loginuser = await registerDeatils.findOne({ email: email });
        if (loginuser) {
            if (email === loginuser.email) {
                res.send({ message: "Login successful", loginuser });

            }
        } else {
            res.status(404).send({ message: "Email not found. Please sign up" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


/*===============Fetch User details===================*/


app.get('/userdata', (req, res) => {
    registerDeatils.find().then(users => res.json(users))
        .catch(err => res.json(err))

})



app.post('/landing', (req, res) => {
    const adminEmail = "bharathsara788@gmail.com";
    const receivedUserEmail = req.body.email;

    console.log(req.body, "Done ahh")


    if (receivedUserEmail === adminEmail) {

        ProjectModels.find()
            .then(projects => res.json(projects))
            .catch(err => {
                console.error("Error fetching projects:", err);
                res.status(500).json({ error: "Internal Server Error" });
            });
    } else {
        ProjectModels.find({ "students.value": receivedUserEmail })
            .then(projects => res.json(projects))
            .catch(err => {
                console.error("Error fetching projects for user:", err);
                res.status(500).json({ error: "Internal Server Error" });
            });
    }
});



app.post('/api/invite', async (req, res) => {
    console.log('request', req.body);
    const { projectTitle, projectDesc, students } = req.body;

    const newProject = new ProjectModels({
        projectTitle,
        projectDesc,
        students
    });
    await newProject.save();
    console.log(newProject);

    const projects = await ProjectModels.find();
    console.log(projects, "Find project");
    const RegisterDetails = await registerDeatils.find();
    // console.log(RegisterDetails, "users");

    RegisterDetails.forEach(async (registerMail) => {
        registerMail.project = [];
        projects.forEach((assignproject) => {
            assignproject.students.forEach((studentMail) => {
                if (studentMail.value == registerMail.email) {
                    registerMail.project.push({
                        projectTitle: assignproject.projectTitle,
                        projectDesc: assignproject.projectDesc
                    });
                    console.log("Data Push that emails", studentMail + "to" + registerMail);
                }
            });
        });
        await registerMail.save(); // Make sure to save inside the forEach loop to save each document
    });

    const data = await mailData.find();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: data[0].toJSON().user,
            pass: data[0].toJSON().pass
        },
    });

    try {
        for (const student of students) {
            console.log("Email sent to", student.value);
            await transporter.sendMail({
                from: "bharathsara788@gmail.com",
                to: student.value,
                subject: projectTitle,
                text: ` Hello ${student.label},
                Your Project has been allocated
                       ${projectDesc}`
            });
        }

        res.send({ message: "Emails sent successfully" });
    } catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).send({ message: "Failed to send emails" });
    }

    console.log(data);
});



//     const { projectTitle, projectDesc, students } = req.body;

//     const newProject = new ProjectModels({
//         projectTitle,
//         projectDesc,
//         students
//     });
//     await newProject.save();
//     console.log(newProject)

//     const projects = await ProjectModels.find()
//     console.log(projects, "Find project")
//     const RegisterDetails = await registerDeatils.find();
//     console.log(RegisterDetails, "users")

//     RegisterDetails.forEach(registerMail => {
//         registerMail.project = [];
//         projects.forEach(assignproject => {
//             assignproject.students.forEach(studentMail => {
//                 if (studentMail.value == registerMail.email) {
//                     registerMail.project.push({
//                         projectTitle: assignproject.projectTitle,
//                         projectDesc: assignproject.projectDesc
//                     });
//                     console.log("Data Push that emails", studentMail + "to" + registerMail)
//                 }
//             });
//         });
//         registerMail.save(); // Make sure to save inside the forEach loop to save each document
//     });

//     mailData.find().then((data) => {
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: data[0].toJSON().user,
//                 pass: data[0].toJSON().pass
//             },
//         });

//         try {
//             for (const student of students) {
//                 console.log("Email sent to", student.value);
//                 transporter.sendMail({
//                     from: "bharathsara788@gmail.com",
//                     to: student.value,
//                     subject: projectTitle,
//                     text: ` Hello ${student.label},
//                     Your Project has been allocated
//                            ${projectDesc}`
//                 });
//             }

//             res.send({ message: "Emails sent successfully" });
//         } catch (error) {
//             console.error("Error sending emails:", error);
//             res.status(500).send({ message: "Failed to send emails" });
//         }

//         console.log(data)
//     }).catch((err) => {
//         console.log(err);
//     })


// });

app.post('/submitData', async (req, res) => {
    const { editForm, userData } = req.body;
    const { name, roll, email } = editForm;
    const { _id } = userData;

    console.log("SumbitData", req.body)

    try {
        // Attempt to update the document in the database
        const updateValue = await registerDeatils.updateOne(
            { _id: _id },
            {
                $set: {
                    name: name,
                    roll: roll,
                    email: email
                }
            }
        );
        // Fetch the updated document
        const updatedDocument = await registerDeatils.findOne({ _id: _id });

        console.log(updateValue, "Document updated successfully");
        res.json({ message: 'Data received and updated successfully', updatedDocument });

    } catch (err) {
        console.error(err, 'Error updating document');
        res.status(500).json({ error: 'Error updating document' });
    }
});



app.delete('/delete', async (req, res) => {
    const { students, projectTitle, projectDesc } = req.body.fproject;
    const { _id } = req.body;
    console.log(req.body, "Project recevied")
    console.log(students, "students recevied")
    console.log(_id, "ID recevied")

    try {
        const deleteData = await ProjectModels.deleteOne({ _id: _id });
        console.log(deleteData, "Data Deleted Successfully");
        // res.json(deleteData);
        for (const studentEmail of students) {
            const registerDetails = await registerDeatils.findOne({ email: studentEmail.value });
            if (!registerDetails) {
                return res.status(404).json({ message: "User not found" });
            }

            console.log(registerDetails, 'find email');
            console.log(studentEmail.value, 'find email');

            const deleteDataUser = await registerDeatils.updateMany(
                { email: studentEmail.value },
                { $pull: { project: { projectTitle: projectTitle, projectDesc: projectDesc } } },


            );
            console.log("Action Status", deleteDataUser, registerDeatils,);
        }


        res.json({ message: "Data deleted and user projects updated successfully" });

    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Error deleting data" });
    }
});



app.listen(3001, function () {

    console.log('Server Connected')
})
