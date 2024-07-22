import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Style from "./VerCartao.module.css";

const VerCartao = () => {
  

  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [newCard, setNewCard] = useState("");
  const [passwordCard, setPasswordCard] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [dataValidade, setDataValidade] = useState("");

  const token = localStorage.getItem('token');

  
    const getDados = async () => {
      try {
        const response = await fetch("http://localhost:3000/verCartao", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Erro ao carregar dados');
        }
        const data = await response.json();
        setNewCard(data.newCard);
        setName(data.name);
        setNumeroCartao(data.newCard.numeroCartao)
        setDataValidade(data.newCard.dataValidade)
        setData(data); // Atualize o estado com os dados recebidos
        setPasswordCard(data.passwordCard)
      } catch (error) {
        console.error('Erro ao obter dados:', error);
        setData([]); 
      }
    };
    
    useEffect(()=>{
      getDados();
    }, []);

  return (
    <div className={Style.containerP}>
      {!newCard ? (
        <div className={Style.containerSemCard}>
          <h1 className={Style.h1}>Seu cartão</h1>
          <p>Você ainda não possui cartão</p>
          <p>Se deseja fazer um clique abaixo</p>
          <button><Link to="/criarCartao">Clique aqui</Link></button>
        </div>
      ) : (
      <div>

    <h1 className={Style.h1}>Seu cartão</h1>
    
    <div className={Style.container}>
  
    <p className={Style.nome}>{name}</p>
    <p className={Style.numeroCartao}>{numeroCartao}</p>
    <p className={Style.dataValidade}>{dataValidade}</p>
  
      <div className={Style.containerImg}>
        <img src="/mastercard_logo.png" alt="" />
        <img src="/chip.png" alt="" />
      </div>
  
      <div className={Style.details}></div>
    </div>

      {passwordCard ? (
      <div className={Style.forgotPassword}>
        <h2>Esqueceu a senha?</h2>
        <p>Clique abaixo para fazer uma nova</p>
        <div>
          <button>
            <NavLink to='/criarSenhaCartao'>
              Redefinir senha
            </NavLink>
          </button>
        </div>
      </div>) : (
        <div>
      <div className={Style.passwordCard}>
        <p>Criar senha para o cartão</p>
        <button className={Style.cardSee}><Link to="/criarSenhaCartao">Clique aqui</Link></button>  
      </div>
        </div>
        ) }


      </div>)}
      
    </div>
  );
};  

export default VerCartao;
