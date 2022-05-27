const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const fileUpload = require("express-fileupload");
const dataLocation = path.join(`${__dirname}/../frontend/data/`);
const uploads = path.join(`${__dirname}/../frontend/public/pizza-images/`);


const getPizzaData = () => {
    const jsonData = fs.readFileSync(`${__dirname}/../frontend/data/data.json`)
    return JSON.parse(jsonData)
}

const getOrderFiles = () => {
    let orderFiles = [];
    let folder = './customerOrders';
    
    fs.readdirSync(folder).forEach(file => {

        let readFile = JSON.parse(fs.readFileSync(`${folder}/${file}`));
        readFile.orderID = `${file.split('.json')[0]}`;
        
        orderFiles.push(readFile);
    });

    fs.writeFileSync("./orders.json", JSON.stringify(orderFiles));

    return JSON.parse(fs.readFileSync("./orders.json"));
};



app.use('/public', express.static(`${__dirname}/../frontend/public`));
app.use('/public', express.static(`${__dirname}/../frontend/data`));
app.use(express.json());
app.use(fileUpload());




app.get('/', (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/admin.html`));
});

app.get('/data', (req, res) => {
    const output = getPizzaData()
    res.send(output)
});

app.get('/orders', (req, res) => {
    const output = getOrderFiles()
    res.send(output)
});


app.post('/putter', (req,res) => {

    const uploads = path.join(`${__dirname}/../frontend/public/pizza-images/`);
    const picture = req.files.picture;
    if (picture) {
        picture.mv(`${uploads}${picture.name}`, error => {
            return res.status(500).send(error);
        });
    }

    const userInput = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        picture: picture.name
    }
    let ogUserData = getPizzaData()

    for (const pizza of ogUserData) {
        if (pizza.id == userInput.id) {
            pizza.name = userInput.name
            pizza.description = userInput.description
            pizza.price = userInput.price
            pizza.picture = picture.name;
        }
    }

    fs.writeFileSync(`${__dirname}/../frontend/data/data.json`, JSON.stringify(ogUserData))
    res.send(ogUserData)
});

app.post('/', (req,res) => {
    let userInput = req.body

    fs.writeFileSync(`./customerOrders/${Date.now()}.json`, JSON.stringify(userInput));

    console.log(userInput)
    res.send(userInput)
});

app.post("/newpizza", (req, res) => {

    const picture = req.files.picture;
    const pizzaFormData = req.body;
    const newPizza = getPizzaData()

    if (picture) {
        picture.mv(`${uploads}${picture.name}`, error => {
            return res.status(500).send(error);
        });
    }

    pizzaFormData.picture = picture.name;

    newPizza.push(pizzaFormData);

    fs.writeFile(`${dataLocation}data.json`, JSON.stringify(newPizza), (error) => {
        if (error) {
            console.log(error);
        }
    });

    res.send("File has been updated")
});


app.delete('/del', (req,res) => {
    const pizzaData = getPizzaData();
    const reqID = req.body.id;
    let modifiedFile = JSON.stringify(pizzaData.filter(data => data.id != reqID));


    fs.writeFileSync(`${__dirname}/../frontend/data/data.json`, modifiedFile);

    
    res.send("Pizza has been deleted");
});



app.listen(9000, () => {
    console.log("http://127.0.0.1:9000");
});