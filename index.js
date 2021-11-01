const express = require('express')
const { MongoClient } = require('mongodb');
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

        // get all the tour programs from database
        app.get("/programs", async (req, res) => {
            const cursor = tourProgramsCollection.find({});
            const tourPrograms = await cursor.toArray();
            res.json(tourPrograms);
        })


    }
    finally {
        // await client.close()
    }



}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('shawon travel network server is running')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})