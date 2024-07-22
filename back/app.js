const express = require("express");
const app = express();
const DbConnect = require("./database/db");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
DbConnect();
const RegistroUser = require("./models/Registro")

app.use(express.json());

app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));



app.get("/", (req,res)=>{
  
  const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Extrai o token do cabeçalho (Bearer token)
    const token = authorizationHeader.split(' ')[1];

    // Verifica e decodifica o token
    jwt.verify(token, 'suaChaveSecreta', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    const email = decoded.email;

    try {
      const response = await RegistroUser.findOne({email})
      res.status(200).json(response);
    } catch (error) {
      console.log("errorrr" + error)      
    }

    });

});

app.post("/", async(req,res)=>{
  const authorizationHeader = req.headers['authorization'];
  

  const money = req.body.money;

  if (!authorizationHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Extrai o token do cabeçalho (Bearer token)
  const token = authorizationHeader.split(' ')[1];

  // Verifica e decodifica o token
  jwt.verify(token, 'suaChaveSecreta', async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
  }

  const email = decoded.email;

  try {
    const user = await RegistroUser.findOne({email})
    
    user.moneyInCash = {
      money
    };

    await user.save();

    return res.status(200).json({ message: 'Dinheiro adicionado com sucesso' });


  } catch (error) {
    console.log("errorrr" + error)      
  }

  });

});

app.post("/registro", async(req,res)=>{
    const name = req.body.name;
    const cpf = req.body.cpf;
    const email = req.body.email;
    const passwordHash = req.body.password;
    const password = await bcryptjs.hash(passwordHash, 10);

    try {
        
        await RegistroUser.findOne({email:email})
        .then(async(user)=>{

            if(user){
            return res.status(400).json({message: "Usuário já existente!"});
            }else{
                const NewUser = new RegistroUser({
                    name,
                    email,
                    cpf,
                    password
                });
                await NewUser.save();
            };
        return res.status(200).json({message: "Cadastrado com sucesso!"});

        })

    } catch (error) {
        return res.status(500).json({ error: "Usuário não existe!" }); //////tem q mudar depois
    }

});

const jwtSecretKey = "suaChaveSecreta";

// Adicione a chave secreta para assinar o token JWT
app.post("/login", async (req, res) => {
    const cpf = req.body.cpf;
    const password = req.body.password;

    try {
        const user = await RegistroUser.findOne({ cpf });

        const validarSenha = await bcryptjs.compare(password, user.password);

        if (!validarSenha) {
            return res.status(401).json({ message: "Senha incorreta" });
        }

        if (!user) {
            return res.status(400).json({ message: "Usuário não encontrado" });
        }else{
            
            // Gere o token JWT
            const token = jwt.sign({name: user.name, email: user.email}, jwtSecretKey, { expiresIn: 2000 });
            
            // Defina o token JWT como um cookie
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hora de validade
            
            // Envie o token na resposta JSON
            return res.status(200).json({ auth: true, token: token, });
        }

    } catch (error) {
        return res.status(500).json({ error: "Usuário não existe!" });
    }
});

/////////CARTÃO

app.get("/criarCartao", async (req, res) => { 

    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Extrai o token do cabeçalho (Bearer token)
    const token = authorizationHeader.split(' ')[1];

    // Verifica e decodifica o token
    jwt.verify(token, 'suaChaveSecreta', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    const email = decoded.email;

    try {
      const response = await RegistroUser.findOne({email})
      res.status(200).json(response);
    } catch (error) {
      console.log("errorrr" + error)      
    }

    });

  });



// Rota para criar um novo cartão e adicionar ao usuário
app.post("/criarCartao", async (req, res) => {
  const { cep, dataNascimento, numeroCasa, numeroTell, selectedCidade, selectedUf } = req.body;

  // Verifica se o cabeçalho Authorization contém um token
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Extrai o token do cabeçalho (Bearer token)
  const token = authorizationHeader.split(' ')[1];

  // Verifica e decodifica o token
  jwt.verify(token, 'suaChaveSecreta', async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    // Aqui você pode acessar as informações decodificadas do token
    const email = decoded.email;

    try {
      // Encontra o usuário pelo email
      const registro = await RegistroUser.findOne({ email });

      if (!registro) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Array para armazenar os números aleatórios
      let numeroCartaoString = [];

      // Gerar 16 números aleatórios
      for (let i = 0; i < 16; i++) {
      // Gerar um número aleatório entre 0 e 100 (exclusivo)
      let numero = Math.floor(Math.random() * 10);
      numeroCartaoString.push(numero);
    };

    let cvcString = [];

    ///Gerar CVC
    for (let i = 0; i < 3; i++){
      let numeroCvc = Math.floor(Math.random() * 10);
      cvcString.push(numeroCvc)
    };

    const dataAtual = new Date();
    const anoCompleto = dataAtual.getFullYear() + 10;

    const mesCompleto = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    const anoDataValidade = anoCompleto % 100;

      const dataValidade = `${mesCompleto}/${anoDataValidade}`;

      const cvc = cvcString.join(''); 

      const numeroCartao = numeroCartaoString.join('');


      // Adiciona informações do novo cartão ao documento do usuário
      registro.newCard = {
        cep,
        dataNascimento,
        numeroCasa,
        numeroTell,
        selectedCidade,
        selectedUf,
        cvc,
        dataValidade,
        numeroCartao
      };

      // Salva as alterações no documento do usuário
      await registro.save();

      return res.status(200).json({ message: 'Cartão criado e adicionado com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao processar a requisição' });
    }
  });
});

app.get("/verCartao", (req,res)=>{
  const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Extrai o token do cabeçalho (Bearer token)
    const token = authorizationHeader.split(' ')[1];

    // Verifica e decodifica o token
    jwt.verify(token, 'suaChaveSecreta', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    const email = decoded.email;

    try {
      const response = await RegistroUser.findOne({email})
      res.status(200).json(response);
    } catch (error) {
      console.log("errorrr" + error)      
    }

    });
});

app.post("/criarSenhaCartao", async(req,res)=>{

  const {password} = req.body;

  const passwordCard = await bcryptjs.hash(password, 10);
  
  
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authorizationHeader.split(' ')[1];

  jwt.verify(token, 'suaChaveSecreta', async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
  };

  const email = decoded.email;

  try {
    
    const user = await RegistroUser.findOne({ email });
    
    if(!user){
      res.status(400).json({error: "Algo deu errado tente novamente!"})
    }else{
       user.passwordCard = {
        passwordCard
      };

      await user.save();
      return res.status(200).json({ message: 'Senha criada com sucesso' });
    };

  } catch (error) {
    console.log("Errorrrrr" + error)
  }

});

});



app.listen(3000, ()=>{
    console.log("Back-end rodando!!!");
});