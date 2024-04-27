const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(cors())




const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "bharathsara788@gmail.com",
        pass: "oxgm weoc ivrz yfqd",
    },
});



/*===================== mongoose setup===============*/

mongoose.connect("mongodb://127.0.0.1:27017/registerData", {

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






// const {}

/*==================Create Model==============*/



const registerDeatils = new mongoose.model('registerDeatils', registerSchema)

// const projectSchema = new mongoose.model('projectSchema', ProjectSchema)
const ProjectModels = new mongoose.model('ProjectModels', ProjectSchema);


/*================ Register User API==================*/


app.post('/api/register', async (req, res) => {
    console.log(req.body, "data")
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

// app.post('/api/login', async (req, res) => {

//     console.log(req.body)

//     const { email, password } = req.body
//     try {
//         const loginuser = await registerDeatils.findOne({ email: email });

//         if (loginuser) {

//             if (email === loginuser.email) {
//                 res.send({ message: "Login successfull" })

//             } else {

//                 res.send({ message: "Email not found. Please signUp else" })

//             }


//         } else {
//             res.send({ message: "Email not found. Please signUp" })

//         }
//     }
//     catch (err) {

//         res.send(err)
//     }

// })
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

const addbtnStatus = true

app.post('/landing', (req, res) => {
    const adminEmail = "bharathsara788@gmail.com";
    const receivedUserEmail = req.body.email;

    console.log(req.body, "Done ahh")

    if (receivedUserEmail === adminEmail) {

        ProjectModels.find()
            .then(projects => res.json( projects))
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



// app.post('/api/invite', async (req, res) => {
//     console.log('request', req.body)
//     // res.send(res.body)
//     const {projectTitle, projectDesc,students} = req.body
//     // const projectdesc = req.body.projectDesc
//     // const projecttile = req.body.projectTitle
//     // const studentsemail = req.body.students

//     new Promise(async (resolve, reject) => {
//         console.log(students, "Emails")
//         students.forEach(async (student) => {
//             console.log("Email sent to", student.value);
//             try {
//                 await transporter.sendMail({
//                     from: "bharathsara788@gmail.com",
//                     to: student.value,
//                     subject: projectTitle,
//                     text: projectDesc
//                 });

//                 res.send({ message: student.value });
//             }

//             catch (error) {
//                 console.error("Error sending email to", student.value, ":", error);
//             }

//         });
//     }).then((resolve) => {

//         res.send(resolve)
//     }).catch((reject) => {
//         res.send(reject)
//     })



// })

app.post('/api/invite', async (req, res) => {
    console.log('request', req.body);
    const { projectTitle, projectDesc, students } = req.body;

    const newProject = new ProjectModels({
        projectTitle,
        projectDesc,
        students
    });

    const projects = await ProjectModels.find().exec();
    const RegisterDetails = await registerDeatils.find().exec();

    RegisterDetails.forEach(registerMail => {
        registerMail.project = [];
        projects.forEach(assignproject => {
            assignproject.students.forEach(studentMail => {
                if (studentMail.value == registerMail.email) {
                    registerMail.project.push({
                        projectTitle: assignproject.projectTitle,
                        projectDesc: assignproject.projectDesc
                    });
                    console.log("Data Push that emails", studentMail + "to" + registerMail)
                }
            });
        });
        registerMail.save(); // Make sure to save inside the forEach loop to save each document
    });

    // const projects = ProjectModels.find().exec();
    // const RegisterDetails = registerDeatils.find().exec();

    // RegisterDetails.forEach(registerMail => {
    //     registerMail.project = []
    //     projects.foreach(assignproject => {
    //         assignproject.students.forEach(studentMail => {
    //             if (studentMail.value == registerMail.email) {

    //                 registerMail.project.push({
    //                     projectTitle: assignproject.projectTitle,
    //                     projectDesc: assignproject.projectDesc
    //                 })
    //             }

    //         })

    //     })
    // })
    // registerMail.save()

    await newProject.save();
    console.log(newProject)
    try {
        for (const student of students) {
            console.log("Email sent to", student.value);
            await transporter.sendMail({
                from: "bharathsara788@gmail.com",
                to: student.value,
                subject: projectTitle,
                text: projectDesc
            });
        }

        res.send({ message: "Emails sent successfully" });
    } catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).send({ message: "Failed to send emails" });
    }
});




app.listen(3001, function () {

    console.log('Server Connected')
})