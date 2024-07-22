const mongoose = require("mongoose");

const RegistroUser = mongoose.model("registro", {
    name:{
        type: String,
        required: true
    },
    cpf:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    newCard:{
        cep:{
            type: String,
        },
        dataNascimento:{
            type: String,
        },
        numeroCasa:{
            type: String,
        },
        numeroTell:{
            type: String,
        },
        selectedCidade:{
            type: String,
        },
        selectedUf:{
            type: String,
        },
        cvc:{
            type: String,
        },
        numeroCartao:{
            type: String,
        },
        dataValidade:{
            type: String,
        }
    },
    passwordCard:{
        passwordCard:{
            type: String
        }
    },
    moneyInCash:{
        money:{
            type: String
        }
    }
});

module.exports = RegistroUser;