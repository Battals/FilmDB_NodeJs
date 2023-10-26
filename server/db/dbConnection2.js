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
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      
    }
  }
  run().catch(console.dir);

export {client, run}