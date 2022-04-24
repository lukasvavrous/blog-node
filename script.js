const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors")

const UserSchema = require('./Schemas/User');
const PostSchema = require('./Schemas/Post');

const app = express();
const port = app.port || 5000;

mongoose.connect('mongodb://localhost:27017/BlogosDb', {
    useNewUrlParser: true,    
    autoIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () =>  console.log("Connection Successful!"));

app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
    console.log("Middleware custom:",)

    next()
})

app.get('/', (req, res) => {
    res.send("Ok").status(200);
})

app.post('/register', (req, res) => {
    var UserModel = mongoose.model('User', UserSchema, 'Users');    

    var userInstance = new UserModel({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    }); 

    userInstance.save(function (err, user) {                
        if(err) console.log(err)


        if(!user){
            return res.status(409).json({ error: 'Name already used' });
        }

        console.log(user.name + " saved to Users collection.");                               

        res.status(200).send("Ok")
    });
})

app.post('/login', async (req, res) => {
    const UserModel = mongoose.model('User', UserSchema, 'Users');

    let name = req.body.name
    let password = req.body.password 
    
    const query = await UserModel.find({name, password})

    res.json(query).status(200);
})

// app.post('/posts', (req, res) => {
//     var PostsModel = mongoose.model('Post', PostSchema);    

//     var postInstance = new PostsModel({
//         title: req.body.title,
//         author: req.body.author,
//         content: req.body.content
//     }); 

//     postInstance.save(function (err, post) {                
//         if(err) console.log(err)


//         if(!user){
//             return res.status(409).json({ error: 'Name already used' });
//         }

//         console.log(user.name + " saved to Users collection.");                               

//         res.status(200).send("Ok")
//     });
// })


app.get('/posts', async (req, res) => {

    var UserModel = mongoose.model('User', UserSchema, 'Users');    
    
    const query = await UserModel.find({})

    console.log(query)

    let results = getPosts();
    res.end(JSON.stringify(results));
})

app.get('/users', async (req, res) => {
    var UserModel = mongoose.model('User', UserSchema, 'Users');    

    const query = await UserModel.find({})

    console.log('/users', query)

    res.json(query)
});


const getPosts = () =>{    
    return [
        {
            "id": 0,
            "title": "Prvni nadpis",
            "content": "Obsah prvniho clanecku",
            "author": "Jaroušek Z Trocnova"
        },
        {
            "id": 1,
            "title": "druhy nadpis",
            "content": "Obsah prvniho clanecku",
            "author": "Jaroušek Z Trocnova"
        },              
        {
            "id": 2,
            "title": "Prvni nadpis",
            "content": "Obsah prvniho clanecku",
            "author": "Jaroušek Z Trocnova"
        },     
        {
            "id": 3,
            "title": "3 nadpis",
            "content": "Obsah prvniho clanecku",
            "author": "Jaroušek Z Trocnova"
        },     
        {
            "id": 4,
            "title": "4546153 nadpis",
            "content": "Obsah prvniho clanecku",
            "author": "Jaroušek Z Trocnova"
        }       
    ]
}

app.listen(port, function () {
    console.log(`Listening at http://127.0.0.1:${port}`)    
});