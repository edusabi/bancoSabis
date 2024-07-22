import { useEffect, useState } from 'react';

import Style from "./Home.module.css"

import { NavLink } from 'react-router-dom';

import { SiPix } from "react-icons/si";

import { LuSmartphone } from "react-icons/lu";

import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

import { FaPlus } from "react-icons/fa";

import { IoClose } from "react-icons/io5";

import { IMaskInput } from "react-imask";

import { MdAddCard } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa6";

const Home = ({user}) => {

  const [modalVisible, setModalVisible] = useState(true);

  const [modalCreditVisible, setModalCreditVisible] = useState(true);

  const [modalPixVisible, setModalPixVisible] = useState(true);

  const [IoEyeMoney, setIoEyeMoney] = useState(true);
  
  const [moneyView, setMoneyView] = useState(true);

  const [money, setMoney] = useState("");

  const [moneyInCash,setMoneyInCash] = useState('')

  ////Abrir modais
  const addMoney = ()=>{
    if(modalVisible === true){
      setModalVisible(false);
    };
  };

  const addCredit = ()=>{
    if(modalCreditVisible === true){
      setModalCreditVisible(false);
    };
  };

  const addPix = ()=>{
    if(modalPixVisible === true){
      setModalPixVisible(false);
    };
  };

  const handleSubmitForm = async (e)=>{
    e.preventDefault();

    setMoney('')

    const token = localStorage.getItem('token');

    const response = await fetch("http://localhost:3000", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({money})
    });

    setModalVisible(true)

  };

  /////Fechar modais
  const closeModal = ()=>{
    setModalVisible(true);
  }

  const closeModalCredit = ()=>{
    setModalCreditVisible(true);
  };

  const closeModalPix = ()=>{
    setModalPixVisible(true);
  };

  const changeEyeView = ()=>{
    if(IoEyeMoney === true){
      setIoEyeMoney(false);
    }else{
      setIoEyeMoney(true);
    };

    if(moneyView === true){
      setMoneyView(false);
    }else{
      setMoneyView(true);
    };
  };


  const getDados = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch("http://localhost:3000", {
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
      setMoneyInCash(data.moneyInCash.money)
    } catch (error) {
      console.error('Erro ao obter dados:', error);
      
    }
  };


  useEffect(()=>{
    getDados();
  }, [getDados]);

  const handleSubmitCredit = (e)=>{
    e.preventDefault();
  };

  return (
    <div>
        <h1 style={{textAlign:"center", marginTop: "2rem"}}>Seu melhor banco digital, só aqui</h1>

        {modalVisible ? ('') : (
          <div className={Style.modal}>
          <IoClose className={Style.IoClose} onClick={closeModal}/>
          <h1>Quanto você quer enviar para sua conta? </h1>
          <p>
            Por favor, adicione seu valor com " , " por exemplo: 200,00
          </p>
          <p>
            Você só poderá adicionar seu dinheiro apenas uma única vez
          </p>
          <form onSubmit={handleSubmitForm}>
            <input type='number'
            placeholder='Digite o valor'
            onChange={(e)=>setMoney(e.target.value)} 
            value={money} />
            <button>Adicionar</button>
          </form>
        </div>)}

        {modalCreditVisible ? ('') : (
          <div className={Style.modalCredit}>
          <IoClose className={Style.IoClose} onClick={closeModalCredit}/>
          <h1>Escolha qual sua operadora</h1>
            <form onSubmit={handleSubmitCredit}>

              <label>
              <input type='radio' name='qNumero' />
              <span>Claro</span>
              </label>

              <label>
              <input type='radio' name='qNumero' />
              <span>Tim</span>
              </label>

              <label>
              <input type='radio' name='qNumero' />
              <span>Vivo</span>
              </label>

          <h1>Digite seu número</h1>

          <div className={Style.divNumeroCell}>
          <IMaskInput type="text" className={Style.numeroCell} mask="(00) 00000-0000" />
          </div>

              <div className={Style.buttonCell}>
            <button>Enviar recarga</button>
              </div>

            </form>
          </div>
          )}

  {user ? (
    
    <div className={Style.container}>
  
      <div className={Style.saldoConta} onClick={changeEyeView}>
        {moneyView ? (<div>{moneyInCash ? (<div>{moneyInCash}</div>) : (<div>00,00</div>)}</div>) : ('----')}
        {IoEyeMoney ? (<div className={Style.eyeMoney}><IoEye className={Style.IoEye}/></div>) : (<div className={Style.eyeMoney}><IoEyeOff className={Style.IoEye}/></div>)}
      </div>

        
        <div className={Style.iconsBanco}>

        <ul>

          <li onClick={addCredit}>
            <NavLink>
              <div className={Style.LuSmartphone}>
        <LuSmartphone/>
              </div>
            <p>Recarregar celular</p>
            </NavLink>
          </li>

          <li onClick={addMoney}>
            <NavLink>
              <div className={Style.FaPlus}>
        <FaPlus/>
              </div>
            <p>Adicionar dinheiro na conta</p>
            </NavLink>
          </li>

          <li>
          <NavLink to="/verCartao">
          <div className={Style.seeCard}>
          <FaRegCreditCard/>
          </div>
            <p>Ver cartão</p>
          </NavLink>
          </li>

          <li>
          <NavLink to="/criarCartao">
          <div className={Style.addCard}>
          <MdAddCard/>
          </div>
            <p>Criar cartão</p>
          </NavLink>
          </li>
       
        </ul>


        </div>

      </div>
      
    ) : (

      <div className={Style.homeVazia}>
        <h3>Você não possui conta ou não está logado</h3>
        
        <div>
        <button><NavLink to="/login">Login</NavLink></button>
        <button><NavLink to="/registro">Criar conta</NavLink></button>
        </div>

      </div>
)}

    </div>
  )
}

export default Home;