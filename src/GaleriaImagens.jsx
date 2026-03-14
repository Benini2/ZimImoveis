import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import "./galeria-imagens.css";

function GaleriaImagens() {
  const { id } = useParams();
  const [imovel, setImovel] = useState(null);

  useEffect(() => {
    async function buscarImovel() {
      try {
        const res = await fetch("http://localhost:3333/imoveis");
        const data = await res.json();

        const encontrado = data.find((item) => item.id === Number(id));

        setImovel(encontrado);
      } catch (erro) {
        console.error("Erro ao buscar imóvel:", erro);
      }
    }

    buscarImovel();
  }, [id]);

  if (!imovel) return <p>Imóvel não encontrado.</p>;

  const fotos = (() => {
    let imgs = [];

    if (Array.isArray(imovel.imagens)) {
      imgs = [...imovel.imagens];
    } 
    else if (typeof imovel.imagens === "string") {
      try {
        imgs = JSON.parse(imovel.imagens);
      } catch {
        imgs = [imovel.imagens];
      }
    }

    if (imovel.img_capa && !imgs.includes(imovel.img_capa)) {
      imgs.unshift(imovel.img_capa);
    }

    return imgs.filter((img) => typeof img === "string" && img !== "");
  })();

  return (
    <div className="galeria-page">
      <Link to={`/detalhes/${id}`} className="voltar">
        <IoMdArrowRoundBack size={32} />
        <span>Voltar</span>
      </Link>

      <h1 className="galeria-titulo">Galeria de imagens</h1>

      <div className="galeria-grid-page">
        {fotos.map((foto, i) => (
          <img
            key={i}
            src={foto}
            alt={`Imagem ${i + 1}`}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

export default GaleriaImagens;