const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser");

const Product = require('./models/product')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("assets"));

app.get('/', async(req, res) => {
    const products = await Product.find({});
    res.render("index", {products: products});
    // res.send('Nodejs - MongoDB - Website- CRUD')
})

app.get('/products', async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/product/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// add
app.post('/product', async(req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

// update
app.put('/product/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if(!product){
            return res.status(404).json({message: `Không tìm thấy product ID = ${id}`})
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// delete 
app.delete('/product/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message: `Không tìm thấy product ID = ${id}`})
        }
        res.status(200).json(product);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

mongoose.set("strictQuery", false)
mongoose.
connect('mongodb+srv://pvbang:pvbang@pvbang.bywxu9k.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    console.log('MongoDB')
    app.listen(3000, ()=> {
        console.log(`Node: http://localhost:3000/`)
    });
}).catch((error) => {
    console.log(error)
})