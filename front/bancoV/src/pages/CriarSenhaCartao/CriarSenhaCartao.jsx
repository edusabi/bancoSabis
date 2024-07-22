import { useState } from "react";

import Style from "./CriarSenhaCartao.module.css";

import { useNavigate } from 'react-router-dom';

const CriarSenhaCartao = () => {

    const navigate = useNavigate()

    const [passwordCard, setPasswordCard] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem('token');

    const handleSubmitPasswordCard = async (e) => {
        e.preventDefault();

        if (passwordCard !== confirmPassword) {
            return setError("As senhas são diferentes, tente novamente!");
        }

        const passwordData = {
            password: passwordCard  // Enviar como objeto com a chave 'password'
        };

        try {
            const response = await fetch("http://localhost:3000/criarSenhaCartao", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(passwordData)  // Enviar o objeto completo
            });

            if(response.status === 200){
                navigate("/verCartao")
            }
            // Adicionar lógica para tratar a resposta do servidor, se necessário
        } catch (error) {
            console.error('Erro ao enviar requisição:', error);
        }
    };

    return (
        <div className={Style.containerPasswordCard}>
            <h1>CriarSenhaCartao</h1>

            <form onSubmit={handleSubmitPasswordCard}>

                <label>
                    <span>Digite a senha:</span>
                    <input
                        type="password"
                        name="password"
                        onChange={(e) => setPasswordCard(e.target.value)}
                        required
                        value={passwordCard}
                    />
                </label>

                <label>
                    <span>Confirme a senha:</span>
                    <input
                        type="password"
                        name="confirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        value={confirmPassword}
                    />
                </label>

                <button>Enviar senha</button>

            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default CriarSenhaCartao;
