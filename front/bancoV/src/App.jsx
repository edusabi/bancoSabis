import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importação correta do jwt-decode

///// PÁGINAS
import Home from './pages/Home/Home';
import About from './pages/About/About';
import VerCartao from './pages/VerCartao/VerCartao';
import CriarCartao from "./pages/CriarCartao/CriarCartao"
import Login from './pages/Login/Login';
import Registro from './pages/Registro/Registro';
import CriarSenhaCartao from './pages/CriarSenhaCartao/CriarSenhaCartao';

//// AUTH
import { IsAuth } from './Auth';

//// COMPONENTES
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          console.log('Token desativado');
          localStorage.clear();
          setUser(false);
        } else {
          console.log('Token ativo');
          setUser(true);
        }
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        setUser(false);
      }
    } else {
      setUser(false);
    }
  }, [token]);

  const handleClickLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    setUser(false);
  };

  return (
    <BrowserRouter>
      <div className='App'>
        <Navbar handleClickLogout={handleClickLogout} user={user} />
        <Routes>
          <Route path='/' element={<Home user={user}/>}/>
          <Route path='/login' element={<Login />} />
          <Route path='/registro' element={<Registro />} />
          <Route path='/about' element={<About />} />
          <Route path='/criarCartao' element={
            <IsAuth>
              <CriarCartao/>
            </IsAuth>
            }></Route>
          <Route
            path='/verCartao'
            element={
              <IsAuth>
                <VerCartao />
              </IsAuth>
              }
          />
          <Route
            path='/criarSenhaCartao'
            element={
              <IsAuth>
                <CriarSenhaCartao />
              </IsAuth>
              }
          />
          <Route path='*' element={<paginaNaoEncontrada/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
