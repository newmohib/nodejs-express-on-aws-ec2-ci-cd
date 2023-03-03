const express = require('express');
const app = express();
const port = 3002;

app.get('/', (req, res) => {
    res.send("Success Message");
});

app.get('/products', (req, res) => {
    res.send([
        {
            productId: '101',
            price: 100
        },
        {
            productId: '102',
            price: 102
        }
    ])
    
});

app.listen(port, ()=>{
    console.log("Demo app is up and listening to port: ", port);
});
