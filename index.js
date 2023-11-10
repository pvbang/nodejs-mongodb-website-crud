const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser");
const fs = require('fs').promises;
var path = require('path');

const Product = require('./models/product')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(express.static(__dirname + '/views'));

// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

app.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        const indexPath = path.join(__dirname, 'views', 'index.html');

        // Read the HTML file
        let htmlContent = await fs.readFile(indexPath, 'utf-8');

        // Replace the placeholder with the actual product data
        const productsHtml = products.map(product => `
            <tr>
                <td><strong>${product._id}</strong></td>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td><span class="badge bg-label-primary me-1">${product.price}</span></td>
                <td>
                    <div class="dropdown">
                        <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                            <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="/edit/${product._id}">
                                <i class="bx bx-edit-alt me-1"></i> Sửa
                            </a>
                            <button class="dropdown-item" type="button" onclick="deleteProduct('${product._id}')">
                                <i class="bx bx-trash me-1"></i> Xóa
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        `).join('');

        htmlContent = htmlContent.replace('<!-- {{products}} will be replaced with the actual product data -->', productsHtml);

        // Send the modified HTML content
        res.send(htmlContent);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// app.set("view engine", "ejs");
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("assets"));

// app.get('/', async(req, res) => {
//     const products = await Product.find({});
//     res.render("index", {products: products});
// })

app.get('/add', async(req, res) => {
    res.render("add");
})

app.get('/edit/:id', async(req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render("edit", {product: product});
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