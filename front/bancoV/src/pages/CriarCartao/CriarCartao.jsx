////CSS
import Style from "./CriarCartao.module.css"

import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";

import { NavLink, useNavigate } from 'react-router-dom';


const CriarCartao = () => {

    const navigate = useNavigate();

    const [cep, setCep] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [numeroCasa, setNumeroCasa] = useState("");
    const [numeroTell, setNumeroTell] = useState("");
    const [selectedUf, setSelectedUf] = useState(""); // Estado que foi pego com a API
    const [selectedCidade, setSelectedCidade] = useState(""); // Cidade que foi pega com a API

    ////////Armazenar os dados que vem do backEnd
    const [card, setCard] = useState(null);

    const [error, setError] = useState("");
    
    // Selecionar os estados e cidades da API
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);

    useEffect(() => {
        fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then((response) => response.json())
            .then((data) => setEstados(data));
    }, []);

    useEffect(() => {
        if(selectedUf) {
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
                .then((response) => response.json())
                .then((data) => setCidades(data));
        }
    }, [selectedUf]);

    function handleSelectedUf(e) {
        const uf = e.target.value;
        setSelectedUf(uf);
        setSelectedCidade(""); // Limpar a cidade selecionada ao mudar o estado
    };

    function handleSelectedCidade(e) {
        const cidade = e.target.value;
        setSelectedCidade(cidade);
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const NewCard = {
        cep,
        dataNascimento,
        numeroCasa,
        numeroTell,
        selectedCidade,
        selectedUf
      };
    
      // Obtém o token do localStorage (ou de onde quer que esteja armazenado)
      const token = localStorage.getItem('token'); // Certifique-se de ter armazenado o token aqui corretamente
    
      // Envia a requisição para o servidor Node.js
      const response = await fetch("http://localhost:3000/criarCartao", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          "Authorization": `Bearer ${token}` // Inclui o token no cabeçalho Authorization
        },
        body: JSON.stringify(NewCard)
      });

      if(response.status === 200){
        navigate("/verCartao")
      }

    };

        useEffect(() => {
          const token = localStorage.getItem('token');
      
          const dadosCartao = async () => {
            try {
              const responseCartao = await fetch("http://localhost:3000/criarCartao", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                }
              });
      
              const data = await responseCartao.json();
              const card = data.newCard;
              setCard(card);
            } catch (error) {
              console.error('Erro ao obter dados do cartão:', error);
              // Tratar o erro adequadamente, por exemplo, exibir uma mensagem de erro para o usuário
            }
          };
      
          dadosCartao(card);
        }, []);


    return (
        <div>
        
            <h1 className={Style.h1}>Criar cartão</h1>

            {!card ? (<div className={Style.divCardCreate}>
                <form onSubmit={handleSubmit}>
                <label>
                    <span>Data de nascimento:</span>
                    <input 
                        type="date" 
                        name="dataNascimento"
                        required
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)} />
                </label>

                <label>
                    <span>Número da casa/apartamento:</span>
                    <input 
                        type="number" 
                        name="numeroCasa"
                        required
                        placeholder="Digite seu Número"
                        value={numeroCasa}
                        onChange={(e) => setNumeroCasa(e.target.value)} />
                </label>

                <label>
                    <span>CEP:</span>
                    <IMaskInput
                        type="text"
                        onChange={(e) => setCep(e.target.value)}
                        name="cep"
                        value={cep}
                        mask="00000-000"
                    />
                </label>

                <label>
                    <span>Número de celular:</span>
                    <IMaskInput
                        mask="(00) 00000-0000"
                        type="text"
                        onChange={(e) => setNumeroTell(e.target.value)}
                        name="numeroTell"
                        value={numeroTell}
                    />
                </label>

                <label>
                    <span>Estado:</span>
                    <select 
                        name="estado" 
                        id="estado"  
                        required
                        onChange={handleSelectedUf} 
                        value={selectedUf}
                    >
                        <option value="">Escolha um estado</option>
                        {estados.map((estado) => (
                            <option key={estado.id} value={estado.sigla}>{estado.nome}</option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Cidade:</span>
                    <select 
                        name="cidade" 
                        id="cidade" 
                        required
                        disabled={!selectedUf} // Desabilitar se o estado não estiver selecionado
                        onChange={handleSelectedCidade} 
                        value={selectedCidade} 
                    >
                        <option value="">Escolha uma cidade</option>
                        {cidades.map((cidade) => (
                            <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>
                        ))}
                    </select>
                </label>

                <button>Criar cartão</button>

                {error && <div><p>{error}</p></div>}
            </form>
            </div>) : (<div>
                <p className={Style.cardPosue}>Você já possui cartao</p>
                <div className={Style.containerButton}>
                <NavLink to='/verCartao'>
                <button className={Style.button}>Ir para cartão</button>
                </NavLink>
                </div>
            </div>)}

           
        </div>
    );
};

export default CriarCartao;
