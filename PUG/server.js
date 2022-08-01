const express = require("express");
const { Router } = express;
const app = express();
app.use(express.static("public"));

const port = process.env.PORT || 4500
const Contenedor = require('../archivosEnJavascript')

app.use(express.json());
app.use (express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', './views');

const myWine = new Contenedor("../baseProductos.json");

const routerProducto = Router();

app.use("/api/productos", routerProducto);


routerProducto.get("/", (req,res) => {
    myWine.getAll()
        // .then((products)=>res.json(products))
        .then((products)=> res.render("losProductos", {products}))
})

routerProducto.get("/:id", (req,res) => {
    myWine.getById(req.params.id)
        .then((product)=>res.json(product))
})

routerProducto.post("/", (req,res) => {
    myWine.save(req.body)
        // .then((product)=>res.json(product))
        res.redirect("/");
})

routerProducto.put("/:id", (req,res) => {
        myWine.updateProduct(req.params.id, req.body)
            .then((product)=>res.json(product))
            .catch(res.json({error: "Error: el producto no fue encontrado"}))
})

routerProducto.delete("/:id", (req,res) => {
    myWine.deleteById(req.params.id)
        res.send(`Se eliminó el producto con el ID: ${req.params.id}`)
})

const server = app.listen(port, ()=>{
    console.log(`Servidor corriendo en puerto: ${server.address().port}`)
})

app.on('error', (err) => {
    console.log(err)
})


app.get('/', (req, res) => {
    res.header('Content-Type', 'text/html; charset=UTF8')
    res.send(`
            Bienvenido al sitio de Prueba de Server Express <br>
            Seleccione la opción a probar: <br>
            <ul>
                <li><a href="/productos">/productos</a></li>
                <li><a href="/productoRandom">/productoRandom</a></li>
            </ul>
            `)
})

let visitas = 0;

server.on("error", error => console.log(`Error: ${error}`))



