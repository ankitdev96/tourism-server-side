const express = require('express');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const { MongoClient } = require('mongodb');
require('dotenv').config()

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mixgi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
      await client.connect();
      console.log('connected to database');
      
      const database = client.db("tourism");
      const collection = database.collection("services");
      const ordersCollection = database.collection('orders');
      // const orders = database.collection('booked-order');

      // console.log(ordersCollection);

      // get service api
      app.get('/service',async(req,res) => {
            const cursor = collection.find({});
            const services = await cursor.toArray();
            res.send(services);
      })

      app.get('/orders',async(req,res) => {
        const cursor = ordersCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
      })

      //get single service
      app.get('/service/:id', async(req,res) => {
          const id = req.params.id;
          const query = {_id:ObjectId(id)};

          const service = await collection.findOne(query);
          res.json(service);
      })

      //post api
      app.post('/service',async(req,res) => {
        const service = req.body;
        console.log('hit the post api');
        const result = await collection.insertOne(service);


        res.json(result);
      })

      app.post('/orders',async(req,res) => {
        const service = req.body;
        console.log('hit the post api');
        const result = await ordersCollection.insertOne(service);
        console.log(result);


        res.json(result);
      })


      app.delete('/orders/:id',async(req,res) => {
        const id = req.params.id;

        const query = {_id:ObjectId(id)};
        const result = await ordersCollection.deleteOne(query);

        res.json(result);


      })

     
      // create a document to insert
    
    //   const result = await haiku.insertOne(doc);
    //   console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send('running tourism server');
})

app.listen(port,() => {
    console.log('listening to the port',port);
})