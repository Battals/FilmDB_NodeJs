import {MongoClient, ServerApiVersion} from 'mongodb'

const uri = 'mongodb+srv://roniapo:Aappoo123.@cluster0.dhnafxp.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      //await client.close();
    }
  }
  run().catch(console.dir);

export {client, run}