const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const app = express()
const cors = require("cors")
require('dotenv').config()
const port = process.env.PORT || 5000


// middleware 
app.use(cors());
app.use(express.json());


// database connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7niub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("shawon_travel-network");
        const tourProgramsCollection = database.collection("tour_programs");
        const ordersCollection = database.collection("Orders");

        // get all the tour programs from database
        app.get("/programs", async (req, res) => {
            const cursor = tourProgramsCollection.find({});
            const tourPrograms = await cursor.toArray();
            res.json(tourPrograms);
        })
        // get all order of user 
        app.get("/allorders", async (req, res) => {
            const cursor = ordersCollection.find({});
            const allOrders = await cursor.toArray();
            res.json(allOrders);
        })


        //   my order list done
        app.get("/myorders", async (req, res) => {
            const emailData = req.query.email;
            console.log(emailData);
            if (emailData) {
                // Object.values(emailData) 
                const query = { email: emailData };
                const result = await ordersCollection.find(query).toArray();
                console.log(result);
                res.json(result)
            }


        })
        // get new tour program 

        app.post("/program", async (req, res) => {
            const newTourProgram = req.body;
            const result = await tourProgramsCollection.insertOne(newTourProgram);

            res.json(result)
        })

        // post method order placed right fully
        app.post("/program/order", async (req, res) => {

            const newOrder = req.body;
            const result = await ordersCollection.insertOne(newOrder);

            res.json(result);

        })
        // delete method by id 

        app.delete("/order/delete/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);
            res.json(result);


        })


    }
    finally {
        // await client.close()
    }



}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})