const mongoose = require("mongoose");

const DbConnect = ()=>{
    mongoose.connect('mongodb+srv://eduardo:10011997@bancosabis.ob4y4r2.mongodb.net/bancoSabis?retryWrites=true&w=majority&appName=bancoSabis')
    .then(()=>{
        console.log("Database rodando!");
    })
    .catch((err)=>{
        console.log("Deu error" + err);
    });

};

module.exports = DbConnect;