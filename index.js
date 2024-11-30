const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const Brand=require('./models/Brand');

const app=express();
const port=3000;

//MongoDB connection
mongoose.connect('mongodb://localhost:27017/branddb')
.then(()=>console.log('Connected to MongoDB'))
.catch(err=>console.error('Error connecting to MongoDB',err));

//Middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));//fro serving static files

//set EJS as the view engine
app.set('view engine','ejs');

//routes
//Homepage-show all brands and the form for adding a new brands
app.get('/',async(req,res)=>{
    try{
        const brands= await Brand.find();
        res.render("index",{brands});
    }
    catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
});

//Add a new brand 
app.post('/add',async(req,res)=>{
    try{
        const newBrand=new Brand({
            name:req.body.name,
            description:req.body.description
        });
        await newBrand.save();
        res.redirect('/');
    }
    catch(err){
    console.log(err);
    res.status(500).send('Error adding brand')
    }
});

//Edit Brand page-Prepoopulate the form with the existing data
app.get('/edit/:id',async(req,res)=>{
    try{
        const brand= await Brand.findById(req.params.id);
        if(!brand) return res.status(404).send('Brand not found!!');
        res.render('edit',{brand});
    }
    catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
});

//Update a brand
app.post('/edit/:id',async(req,res)=>{
    try{
        await Brand.findByIdAndUpdate(req.params.id,req.body);
        res.redirect('/');
    }
    catch(err){
        console.log(err);
        res.status(500).send('Error updating a brand');
    }
});

//Delete a brand
app.post('/delete/:id',async(req,res)=>{
    try{
        await Brand.findByIdAndDelete(req.params.id);
        res.redirect('/');
    }
    catch(err){
        console.log(err);
        res.status(500).send('Error deleting a brand');
    }
});

//Start the server
app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
});

