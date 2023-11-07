import {MongoClient} from 'mongodb'

const uri = process.env.dbUri

  const client = new MongoClient(uri)



  async function run() {
    try {
      await client.connect();
      const db = client.db("Cluster0")
      await db.command({ ping: 1 });
      console.log("Succesfully connected to MongoDB");
    } 
    catch(error){
console.log(error)
    }
  }


export {client, run}