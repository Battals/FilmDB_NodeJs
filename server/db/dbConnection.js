import {MongoClient} from 'mongodb'


const uri = process.env.dbUri

  const client = new MongoClient(uri)

  console.log(uri)

  async function connectToDb() {
    try {
      await client.connect();
      console.log("Succesfully connected to MongoDB");
    } 
    catch(error){
console.log(error)
    }
  }


  


export {client, connectToDb}