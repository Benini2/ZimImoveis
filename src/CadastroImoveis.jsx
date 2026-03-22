import { useState, useEffect } from "react";
import Card from "./components/Card";
import "./cadastroimoveis.css";
import { FaImage } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

function normalizarImagem(img) {
  if (!img) return "";
  if (typeof img === "object") return img.url || img.src || "";
  return img;
}

const estados = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO",
  "MA","MT","MS","MG","PA","PB","PR","PE","PI",
  "RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

const tipo = [
  "Casa",
  "Apartamento",
  "Sala Comercial",
  "Estudio",
  "Terreno"
];

const opcoesEstrutura = [
  "Piscina",
  "Churrasqueira",
  "Salão de festas",
  "Lavanderia",
  "Sacada ",
  "Quintal"
];

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CadastroImoveis() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);

  const [imoveis, setImoveis] = useState([]);
  const [erros, setErros] = useState({});
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    preco: "",
    imagens: [],
    quartos: "",
    suites: "",
    vagas: "",
    area: "",
    bairro: "",
    cidade: "",
    estado: null,
    tipo: null,
    estrutura: [],
  });

  useEffect(() => {
    async function buscarImoveis() {
      try {
        const response = await fetch("https://zimimoveis-production.up.railway.app/imoveis");
        const data = await response.json();

        const dadosNormalizados = data.map((item) => ({
          ...item,
          imagens: Array.isArray(item.imagens) ? item.imagens : [],
          img_capa: item.img_capa,
        }));

        setImoveis(dadosNormalizados);
      } catch (err) {
        console.error("Erro ao buscar imóveis:", err);
      }
    }

    buscarImoveis();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (erros[name]) {
      setErros({ ...erros, [name]: false });
    }
  }

  function handleSelectChange(option, actionMeta) {
    setForm({
      ...form,
      [actionMeta.name]: option || null,
    });

    if (erros[actionMeta.name]) {
      setErros({ ...erros, [actionMeta.name]: false });
    }
  }

  function formatarPreco() {
    if (!form.preco) return;

    const numero = parseFloat(form.preco);
    if (isNaN(numero)) return;

    setForm({
      ...form,
      preco: `R$ ${numero.toLocaleString("pt-BR")}`,
    });
  }

  function formatarArea() {
    if (!form.area) return;

    const valorLimpo = form.area.toString().replace(/\D/g, "");
    const valorNumerico = Number(valorLimpo);

    if (isNaN(valorNumerico)) {
      setForm({ ...form, area: "" });
      return;
    }

    setForm({
      ...form,
      area: `${valorNumerico} m²`,
    });
  }

  async function handleCapa(e) {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      const urls = await Promise.all(
        [...Array.from(files)].map((f) => fileToDataUrl(f))
      );

      const novas =
        form.imagens.length === 0
          ? urls
          : [urls[0], ...form.imagens.slice(1)];

      setForm({ ...form, imagens: novas });

      if (erros.imagens) setErros({ ...erros, imagens: false });
    } catch (err) {
      console.error("Erro ao ler imagem:", err);
    }

    e.target.value = "";
  }

  async function handleMaisFotos(e) {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      const urls = await Promise.all(
        [...Array.from(files)].map((f) => fileToDataUrl(f))
      );

      setForm({
        ...form,
        imagens: [...form.imagens, ...urls],
      });

      if (erros.imagens) setErros({ ...erros, imagens: false });
    } catch (err) {
      console.error("Erro ao ler imagens:", err);
    }

    e.target.value = "";
  }

  function removerImagem(index) {
    const novas = form.imagens.filter((_, i) => i !== index);

    setForm({ ...form, imagens: novas });

    if (erros.imagens && novas.length > 0) {
      setErros({ ...erros, imagens: false });
    }
  }

  function validarFormulario() {
    const novosErros = {};

    if (!form.nome?.trim()) novosErros.nome = true;
    if (!form.preco?.trim()) novosErros.preco = true;
    if (!form.imagens || form.imagens.length < 3) novosErros.imagens = true;

    if (!form.quartos && form.quartos !== 0) novosErros.quartos = true;
    if (!form.suites && form.suites !== 0) novosErros.suites = true;
    if (!form.vagas && form.vagas !== 0) novosErros.vagas = true;

    if (!form.area) novosErros.area = true;
    if (!form.bairro?.trim()) novosErros.bairro = true;
    if (!form.cidade?.trim()) novosErros.cidade = true;
    if (!form.estado) novosErros.estado = true;
    if (!form.tipo) novosErros.tipo = true;
    if (!form.estrutura?.length) novosErros.estrutura = true;

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  }

  async function salvarNoBackend() {
    const token = localStorage.getItem("token");
    const BASE_URL = "https://zimimoveis-production.up.railway.app";

    const url = editandoId
      ? `${BASE_URL}/imoveis/${editandoId}`
      : `${BASE_URL}/imoveis`;

    const method = editandoId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        preco: Number(form.preco.replace(/\D/g, "")),
        area: Number(form.area.toString().replace(/\D/g, "")),
        estado: form.estado?.value,
        tipo: form.tipo?.value,
        img_capa: form.imagens[0],
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao salvar no backend");
    }

    return await response.json();
  }

  async function adicionarImovel() {
    if (!validarFormulario()) return;

    try {
      await salvarNoBackend();

      const response = await fetch("https://zimimoveis-production.up.railway.app/imoveis");
      const data = await response.json();

      const dadosNormalizados = data.map((item) => ({
        ...item,
        imagens: Array.isArray(item.imagens) ? item.imagens : [],
        img_capa: item.img_capa,
      }));

      setImoveis(dadosNormalizados);

      setForm({
        nome: "",
        preco: "",
        imagens: [],
        quartos: "",
        suites: "",
        vagas: "",
        area: "",
        bairro: "",
        cidade: "",
        estado: null,
        tipo: null,
        estrutura: [],
      });

      setEditandoId(null);
      setErros({});
    } catch (err) {
      console.error("Erro ao adicionar:", err);
    }
  }

  function editar(id) {
    const imovel = imoveis.find((i) => i.id === id);
    if (!imovel) return;

    const optionsEstados = estados.map((uf) => ({ value: uf, label: uf }));
    const optionsTipo = tipo.map((t) => ({ value: t, label: t }));

    const precoFormatado = imovel.preco
      ? `R$ ${Number(imovel.preco).toLocaleString("pt-BR")}`
      : "";

    const areaLimpa = imovel.area
      ? imovel.area.toString().replace(/\D/g, "")
      : "";

    setForm({
      nome: imovel.nome || "",
      preco: precoFormatado,
      imagens: Array.isArray(imovel.imagens)
        ? imovel.imagens
        : imovel.img_capa
        ? [imovel.img_capa]
        : [],
      quartos: imovel.quartos || "",
      suites: imovel.suites || "",
      vagas: imovel.vagas || "",
      area: areaLimpa,
      bairro: imovel.bairro || "",
      cidade: imovel.cidade || "",
      estado: imovel.estado
        ? optionsEstados.find((opt) => opt.value === imovel.estado)
        : null,
      tipo: imovel.tipo
        ? optionsTipo.find((opt) => opt.value === imovel.tipo)
        : null,
      estrutura: Array.isArray(imovel.estrutura)
        ? imovel.estrutura
        : [],
    });

    setEditandoId(id);
    setErros({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deletar(id) {
    const token = localStorage.getItem("token");

    try {
      await fetch(`https://zimimoveis-production.up.railway.app/imoveis/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await fetch("https://zimimoveis-production.up.railway.app/imoveis");
      const data = await response.json();

      const dadosNormalizados = data.map((item) => ({
        ...item,
        imagens: Array.isArray(item.imagens)
          ? item.imagens.map(normalizarImagem)
          : [],
        img_capa: normalizarImagem(item.img_capa),
      }));

      setImoveis(dadosNormalizados);
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  }

  return (
    <div className="container">
      <h1 className="titulo">
        {editandoId ? "Editar Imóvel" : "Cadastro de Imóveis"}
      </h1>

      <div className="cards-grid">
        {imoveis.map((item) => (
          <Card
            key={item.id}
            {...item}
            onDelete={deletar}
            onEdit={editar}
          />
        ))}
      </div>
    </div>
  );
}