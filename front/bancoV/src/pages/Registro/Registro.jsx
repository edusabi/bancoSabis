import Style from "./Registro.module.css"

import { useEffect, useState } from "react";

import { IMaskInput } from "react-imask";

import { useNavigate } from "react-router-dom";

const Registro = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmitRegistro = async(e)=>{
    e.preventDefault();

    const NewUser = {
      name,
      cpf,
      email,
      password,
      confirmPassword
    };

    const response = await fetch("http://localhost:3000/registro",
      {
        method: "post",
        headers:{
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(NewUser)
      }
    );

    const data = await response.json();

    if(response.status == 200){
      navigate("/login");
    }

    setEmail("")
    setCpf("")
    setName("")
    setPassword("")
    setConfirmPassword("")

  };

  return (
    <div className={Style.containerRegistro}>
        <h1>Registro</h1>

        <form onSubmit={handleSubmitRegistro}>

          <label>
            <span>Digite seu nome completo:</span>
            <input type="text" name="name" 
            onChange={(e)=>setName(e.target.value)}
            value={name}
            required/>
          </label>

          <label>
              <span>Digite seu CPF:</span>
              <IMaskInput
              onChange={(e)=> setCpf(e.target.value)}
              name="cpf"
              value={cpf}
              mask="000.000.000-00"
              />
          </label>

          <label>
            <span>Digite seu Email:</span>
            <input type="email" name="email" 
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
            required/>
          </label>

          <label>
            <span>Digite sua senha:</span>
            <input type="password" name="password" 
            onChange={(e)=>setPassword(e.target.value)}
            value={password}
            required/>
          </label>

          <label>
            <span>Confirme sua senha:</span>
            <input type="password" name="password"
            onChange={(e)=>setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required/>
          </label>

          <div>
          <button>Enviar cadastro</button>
          </div>

        </form>

    </div>
  )
}

export default Registro