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

app.post('/posts', (req, res) => {
    var PostsModel = mongoose.model('Post', PostSchema);    

    var postInstance = new PostsModel({
        title: req.body.title,
        author: req.body.author,
        content: req.body.content
    }); 

    postInstance.save(function (err, user) {                
        if(err) console.log(err)


        if(!user){
            return res.status(409).json({ error: 'Name already used' });
        }

        console.log(user.name + " saved to Users collection.");                               

        res.status(200).send("Ok")
    });
})

app.listen(port, function () {
    console.log(`Listening at http://127.0.0.1:${port}`)    
});