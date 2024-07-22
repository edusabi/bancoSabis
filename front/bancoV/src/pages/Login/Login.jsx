import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMaskInput } from "react-imask";

import Style from "./Login.module.css"

const Login = () => {

  const navigate = useNavigate();

  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleSubmitLogin = async(e)=>{
    e.preventDefault();

    const User = {
      cpf,
      password
    };

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(User),
      credentials: "include"
  });

    const data = await response.json();

    console.log(data)

    if(data.token){
      localStorage.setItem("token", data.token)
      
      navigate("/")
      location.reload()
      
    }else{
      navigate("/login")
      if(response.status === 500){
        setError(data.error);
      }else{
        setError(data.message);
      }
    };

  };

  return (
    <div className={Style.containerLogin}>
        <h1>Login</h1>

        <form onSubmit={handleSubmitLogin}>

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
              <span>Digite sua senha:</span>
              <input type="password" name="password" 
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
              required />
          </label>

          <div className={Style.formButton}>
          <button>Entrar</button>
          </div>

          {error}

        </form>
    </div>
  )
}

export default Login