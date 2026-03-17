import Header from "./components/Header";
import { Link } from "react-router-dom";
import "./home.css";
import Info from "./components/Info"
import { useState, useEffect } from "react";

function Home() {

  const [imoveis, setImoveis] = useState([]); 
  useEffect(() => {
    async function buscarImoveis() {
      try {
        const response = await fetch("https://zimimoveis-production.up.railway.app/imoveis");
        const data = await response.json();
        setImoveis(data);
      } catch (err) {
        console.error("Erro ao buscar imóveis:", err);
      }
    }

    buscarImoveis();
  }, []);

  return (
    <div className="home">
      <Header />

      <main className="home-conteudo">
        <h2 className="legenda-home">
          <span className="type-line line-1">Encontre o imóvel</span>
          <span className="type-line line-2">ideal com a Zim.</span>
        </h2>

        <div className="home-card">
          <div className="home-numeros">
            <div>
              <strong>16+</strong>
              <span>anos de mercado</span>
            </div>

            <div>
              <strong>Venda</strong>
              <span>e locação</span>
            </div>

            <div>
              <strong>{imoveis.length}</strong>
              <span>imóveis</span>
            </div>
          </div>

          <Link to="/catalogo" className="home-btn">
            Ver catálogo
          </Link>
        </div>
      </main>

      <div className="home-fundo" />
      <Info/>
    </div>
  );
}

export default Home;