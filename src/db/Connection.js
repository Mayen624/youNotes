import mongoose from "mongoose";

class Connection {
    
    constructor() {
        this.user = process.env.DB_user;
        this.pass = process.env.DB_pass;
        this.dbname = process.env.DB_name;
        this.conn = null;
    }

    async connectDB() {
        if(!this.conn){
            let URI = "mongodb+srv://" + this.user + ":" + this.pass + "@younotes.lqxi7zf.mongodb.net/" + this.dbname + "?retryWrites=true&w=majority";
            try{
                this.conn = await  mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
                console.log('**Conexión a la base de datos abierta**');
            }catch(error){
                console.log(error);
            }
        }

        return this.conn;

    }

    closeDB() {
        this.conn = null;
        mongoose.disconnect().then(()=>{
            console.log('**Conexión a la base de datos cerrada**');
        });
    }
}

module.exports = Connection;