const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      morgan  = require('morgan'),
      cors  = require('cors'),
      fs   = require('fs'),
      app   = express();
require('dotenv').config();

mongoose.connect(`mongodb+srv://abhi:mongo@abhi@cluster0.ddjzu.mongodb.net/ecom?retryWrites=true&w=majority`, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true 
}).then(()=>{
    console.log(`DATABASE CONNECTED!!`)
}).catch((err)=>{
    console.log(err)
})

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({limit:'50mb'}))
app.use(cors());
app.use(morgan('tiny'));

fs.readdirSync('./routes').map((f)=>{
    app.use('/api', require("./routes/" + f))
})

app.get('/', (req, res)=>{
    res.send('WELCOME MASTER!!')
})

app.listen(process.env.PORT, (err)=>{
    if (err) throw err;
    console.log('ECOMMERCE SERVER IS STARTED!!')
})