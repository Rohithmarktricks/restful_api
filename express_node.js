const Joi = require("joi");
const express =  require('express');
const app = express();

app.use(express.json());

const courses = [
    { id:1, name: 'course1' },
    { id:2, name: 'course2' },
    { id:3, name: 'course3' }

];


app.get('/',(req, res)=>{
    res.send("Welcome to the courses.");
});

app.get('/api/courses', (req, res)=>{
    res.send(courses);
});
// api/courses/1 ... to get 1st course in the list, routing

app.get('/api/courses/:id', (req, res)=>{
    // res.send(req.params.id);
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send("The course with the given ID was not found.");
    res.send(course.name);
});

// http://localhost:3000/api/courses/2018/march?name=rohith... after question mark.
// app.get('/api/courses/:year/:month', (req, res)=>{
//     res.send(req.query)
// })

app.post('/api/courses', (req, res)=>{
    // const schema = {
    //     name: Joi.string().min(3).required()
    // };

    // const result = Joi.validate(req.body, schema);

    const { error }=validateCourse(req.body);

    // result has two attributes: error and the value it holds.
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    };


    // validation can be better handled using joi; node package
    // if (! req.body.name || req.body.name.length < 3){
    //     res.status(400).send("Name is required and should be minimum 3 characters.");
    //     return;
    // };


    const course = {
        id:courses.length + 1,
        name : req.body.name
    };
    courses.push(course);
    // sender/client might want to know about the course that was uploaded.
    res.send(course);
})


// PUT method

app.put('/api/courses/:id', (req, res)=>{
    // Look up the course
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send("The course with the given ID was not found.");

    // Validate
    // If invalid, return 404 - Bad request
    // const schema = {
    //     name: Joi.string().min(3).required()
    // };
    // const result = Joi.validate(req.body, schema);
    // const result = validateCourse(req.body);
    // we only need result.error in two different places for validation. We can get this by object destructuring.
    const { error } = validateCourse(req.body); // This is equivalent to result.error

    if(error){
        res.status(400).send(error.details[0].message);
        return;
    };

    // Update course
    course.name = req.body.name;
    // Return the updated course
    res.send(course);

})

// HTTP delete request

app.delete('/api/courses/:id', (req, res)=>{
    // Look up the course
    // If it doesn't exist then return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send("The course with the given ID was not found");

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the deleted course, for the reference only.
    res.send(course);
});

















// Lets create a function to validate the course
function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);

}


// PORT
const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Listening on port ${port}...`));