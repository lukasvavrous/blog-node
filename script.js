const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")

const UserSchema = require('./Schemas/User');
const PostSchema = require('./Schemas/Post');

const app = express();
const port = process.env.PORT || 5000;

const atlasDb = 'mongodb+srv://adminuser:adminuser@cluster0.4y9pc.mongodb.net/?retryWrites=true&w=majority'
const localDb = 'mongodb://localhost:27017/BlogosDb'

mongoose.connect(atlasDb, {
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
    
    let _pass = bcrypt.hashSync(req.body.password, 10);

    console.log(_pass)

    var userInstance = new UserModel({
        name: req.body.name,
        password: _pass,
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
    
    const query = await UserModel.findOne({name})           

    let isRight = await bcrypt.compare(password, query.password);

    if(query && isRight){
        jwt.sign({query}, 'secretkey', (err, token) => {
            res.json({
                token
            })
        })
    }
    else{
        res.send(403);
    }
})

app.put('/posts', async (req, res) => {
    const PostModel = mongoose.model('Post', PostSchema, 'Posts');

    console.log(req.body.author)

    var postInstance = new PostModel({        
        author: req.body.author,
        title: req.body.title,
        content: req.body.content
    });    
    
    let savePostResponse = await postInstance.save()

    res.json(savePostResponse).status(200);
})

app.get('/posts', parseToken, async (req, res) => {

    console.log(req.token)

    const PostModel = mongoose.model('Post', PostSchema, 'Posts');
    
    const query = await PostModel.find({})
    
    res.json(query)
})

app.get('/posts/:name', parseToken, async (req, res) => {
    let name = req.params['name']

    const PostModel = mongoose.model('Post', PostSchema, 'Posts');
    
    const query = await PostModel.find({author: name})

    res.json(query)
})

app.post('/updatePost', async (req, res) => {    
    let id = req.body.id;
    let content = req.body.content;

    const PostModel = mongoose.model('Post', PostSchema, 'Posts');
    
    let type = (req.body.type == "title" ? "title" : "content");    

    let query = { [type] : content};    

    let result = await PostModel.findByIdAndUpdate(id, query, {new: true})

    res.send(result)
})

app.post('/deletePost', async (req, res) => {    
    let id = req.body.id;

    const PostModel = mongoose.model('Post', PostSchema, 'Posts');        

    let result = await PostModel.findByIdAndDelete(id)
    
    res.send(result)
})

app.get('/users', async (req, res) => {
    var UserModel = mongoose.model('User', UserSchema, 'Users');    

    const query = await UserModel.find({}, 'name createdAt')

    console.log(query)

    console.log("sleep")
    await sleep(1000);
    console.log("end sleep")

    res.json(query)
});

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

function tokenPermitOnly(req, res, next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next()
    }
    else{
        res.sendStatus(403);
    }
}

function parseToken(req, res, next){    
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        console.log("bearer detected")
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next()
    }
    else{
        console.log("bearer no-detected")

        next();
    }
}

app.listen(port, function () {    
    console.log(`Listening at http://127.0.0.1:${port}`)    
});