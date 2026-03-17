      import { useState, useEffect } from "react";
      import Card from "./components/Card";
      import "./cadastroimoveis.css";
      import { FaImage } from "react-icons/fa6";
      import { IoIosArrowDown } from "react-icons/io";
      import Select from "react-select";
      import { useNavigate } from "react-router-dom";

      function normalizarImagem(img) {
        if (!img) return "";
      
        // se for objeto (ex: { url: "..." })
        if (typeof img === "object") {
          img = img.url || img.src || "";
        }
      
        // agora garante que é string
        if (typeof img !== "string") return "";
      
        if (img.startsWith("data:")) return img;
      
        return `data:image/avif;base64,${img}`;
      }
      
      
      
      const estados = [
        "AC","AL","AP","AM","BA","CE","DF","ES","GO",
        "MA","MT","MS","MG","PA","PB","PR","PE","PI",
        "RJ","RN","RS","RO","RR","SC","SP","SE","TO"
      ];

      

      const tipo = [
        "Casa", "Apartamento", "Sala Comercial", "Estudio", "Terreno"
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

    if (!token) {
      navigate("/login");
    }

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
                imagens: Array.isArray(item.imagens)
                  ? item.imagens.map(normalizarImagem)
                  : [],
                img_capa: normalizarImagem(item.img_capa),
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
        
          setForm({
            ...form,
            [name]: value
          });
        
          if (erros[name]) {
            setErros({ ...erros, [name]: false });
          }
        }

        function handleSelectChange(option, actionMeta) {
          setForm({
            ...form,
            [actionMeta.name]: option || null, 
          });

          if (erros[actionMeta.name]) setErros({ ...erros, [actionMeta.name]: false });
        }

        function formatarPreco() {

          if (!form.preco) return;
        
          const numero = parseFloat(form.preco);
        
          if (isNaN(numero)) return;
        
          setForm({
            ...form,
            preco: `R$ ${numero.toLocaleString("pt-BR")}`
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
            area: `${valorNumerico} m²`
          });
        
        }

        async function handleCapa(e) {
          const files = e.target.files;
          if (!files?.length) return;
          try {
            const urls = await Promise.all([...Array.from(files)].map((f) => fileToDataUrl(f)));
            const novas = form.imagens.length === 0 ? urls : [urls[0], ...form.imagens.slice(1)];
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
            const urls = await Promise.all([...Array.from(files)].map((f) => fileToDataUrl(f)));
            setForm({ ...form, imagens: [...form.imagens, ...urls] });
            if (erros.imagens) setErros({ ...erros, imagens: false });
          } catch (err) {
            console.error("Erro ao ler imagens:", err);
          }
          e.target.value = "";
        }

        function removerImagem(index) {
          const novas = form.imagens.filter((_, i) => i !== index);
          setForm({ ...form, imagens: novas });
          if (erros.imagens && novas.length > 0) setErros({ ...erros, imagens: false });
        }

        function validarFormulario() {
          const novosErros = {};
          if (!form.nome?.trim()) novosErros.nome = true;
          if (!form.preco?.trim()) novosErros.preco = true;
          if (!form.imagens || form.imagens.length < 3) {
            novosErros.imagens = true;
          }      
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
              "Authorization": `Bearer ${token}`
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
        
            // 🔥 Rebuscar do banco após salvar
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
            estrutura: Array.isArray(imovel.estrutura) ? imovel.estrutura : [],
          });
        
          setEditandoId(id);
          setErros({});
          window.scrollTo({ top: 0, behavior: "smooth" });
        }

        async function deletar(id) {
          const token = localStorage.getItem("token");
        
          try {
        
            await fetch(`https://zimimoveis-production.up.railway.app/imoveis/${id}`, 
              { method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`
              }
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

        const optionsEstados = estados.map((uf) => ({ value: uf, label: uf }));
        const optionsTipo = tipo.map((t) => ({ value: t, label: t }));

        const customSelectStyles = {
          control: (base, state) => ({
            ...base,
            backgroundColor: 'white',
            borderRadius: 8,
            border: state.isFocused ? "1.8px solid #c1473d" : "1.8px solid #ccc",
            minHeight: 46,
            fontSize: "1rem",
            boxShadow: state.isFocused ? "0 0 6px rgba(193, 71, 61, 0.5)" : "none",
            "&:hover": { borderColor: state.isFocused ? "#c1473d" : "#ccc" },
            cursor: 'pointer',
          }),
          valueContainer: (base) => ({
            ...base,
            padding: "0 12px",
            display: 'flex',
            alignItems: 'center',
          }),
          placeholder: (base) => ({ 
            ...base, 
            fontSize: "1rem", 
            color: "#555",
            opacity: 1,
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }),
          singleValue: (base) => ({ 
            ...base, 
            fontSize: "1rem", 
            color: "#333",
            opacity: 1,
            position: 'relative',
          }),
          input: (base) => ({
            ...base,
            fontSize: "1rem",
            color: "#333",
            padding: 0,
            margin: 0,
          }),
          menu: (base) => ({
            ...base,
            borderRadius: 8,
            zIndex: 9999,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            backgroundColor: 'white',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "rgba(193, 71, 61, 0.1)" : "white",
            color: "#333",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "10px 12px",
            "&:hover": { backgroundColor: "rgba(193, 71, 61, 0.1)" },
          }),
          dropdownIndicator: (base) => ({ 
            ...base, 
            padding: "0 8px",
            color: "#ccc",
            "&:hover": { color: "#c1473d" },
          }),
          indicatorSeparator: (base) => ({ ...base, display: "none" }),
          clearIndicator: (base) => ({ ...base, padding: "0 8px" }),
        };

      const [estruturaAberta, setEstruturaAberta] = useState(false);

      function toggleEstrutura(item) {
        if (form.estrutura.includes(item)) {
          setForm({ ...form, estrutura: form.estrutura.filter(i => i !== item) });
        } else {
          setForm({ ...form, estrutura: [...form.estrutura, item] });
        }
      }

      function removerEstrutura(item) {
        setForm({ ...form, estrutura: form.estrutura.filter(i => i !== item) });
      }

        return (
          <div className="container">
            <h1 className="titulo">{editandoId ? "Editar Imóvel" : "Cadastro de Imóveis"}</h1>
            <p className="subtitulo">{editandoId ? "Altere os dados abaixo e salve as alterações." : "Preencha os dados abaixo para adicionar um novo imóvel ao catálogo."}</p>
            <div className="main-content">
            <div className="form-card">
            <div className={`form-group upload-group ${erros.imagens ? "erro" : ""}`}>
              {form.imagens.length === 0 ? (
                <label htmlFor="fileInputCapa" className="file-label file-label-capa">
                  <FaImage size={32} className="image-icon" />
                  <span className="upload-text">Foto de capa</span>
                  <span className="upload-hint">Clique para adicionar</span>
                  <input
                    id="fileInputCapa"
                    type="file"
                    accept="image/*"
                    onChange={handleCapa}
                    className="file-hidden"
                    aria-label="Adicionar foto de capa"
                  />
                </label>
              ) : (
                <div className="preview-capa-wrapper">
                  <img src={form.imagens[0]} alt="Capa do imóvel" className="preview-capa-img" />
                  <div className="preview-capa-actions">
                    <label htmlFor="fileInputCapa" className="preview-capa-btn">Alterar capa</label>
                    <input
                      id="fileInputCapa"
                      type="file"
                      accept="image/*"
                      onChange={handleCapa}
                      className="file-hidden"
                      aria-label="Alterar foto de capa"
                    />
                    <button
                      type="button"
                      className="preview-capa-btn preview-capa-remove"
                      onClick={() => removerImagem(0)}
                      aria-label="Remover foto de capa"
                    >
                      Remover
                    </button>
                  </div>
                  <span className="preview-capa-badge">Capa</span>
                  {erros.imagens && <span className="campo-erro">Adicione pelo menos a foto de capa.</span>}
                </div>
              )}
              {form.imagens.length > 0 && (
                <>
                  <label htmlFor="fileInputMore" className="btn-adicionar-mais">
                    <span className="btn-mais-icon">+</span>
                    Adicionar mais fotos
                  </label>
                  <input
                    id="fileInputMore"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMaisFotos}
                    className="file-hidden"
                    aria-label="Adicionar mais fotos"
                  />
                  {form.imagens.length > 1 && (
                    <div className="preview-list">
                      {form.imagens.slice(1).map((url, index) => (
                        <div key={url} className="preview-item">
                          <img src={url} alt={`Foto ${index + 2}`} className="preview-thumb" />
                          <button
                            type="button"
                            className="preview-remove"
                            onClick={() => removerImagem(index + 1)}
                            aria-label={`Remover foto ${index + 2}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {erros.imagens && (
        <span className="campo-erro">
          Adicione no mínimo 3 imagens.
        </span>
      )}
            </div>

            <div className="form">
              <h3 className="form-section-title">Dados do imóvel</h3>
              <div className="form-group">
                <input
                  className={`input-field ${erros.nome ? "erro" : ""}`}
                  name="nome"
                  type="text"
                  placeholder="Nome"
                  value={form.nome}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <input
                  className={`input-field ${erros.preco ? "erro" : ""}`}
                  name="preco"
                  type="text"
                  placeholder="Preço"
                  value={form.preco}
                  onChange={handleChange}
                  onBlur={formatarPreco}
                />
              </div>

              <h3 className="form-section-title">Localização</h3>
              <div className="form-group" id="endereco">
                <input
                  className={`input-field ${erros.cidade ? "erro" : ""}`} id="cidade"
                  name="cidade"
                  type="text"
                  placeholder="Cidade"
                  value={form.cidade}
                  onChange={handleChange}
                />

                <Select
                isSearchable={false}
                  id="estado"
                  name="estado"
                  value={form.estado}
                  onChange={handleSelectChange}
                  options={optionsEstados}
                  classNamePrefix="react-select"
                  placeholder="Estado"
                  styles={customSelectStyles}
                />
              </div>

              <div className="form-group">
                <input
                  className={`input-field ${erros.bairro ? "erro" : ""}`}
                  name="bairro"
                  type="text"
                  placeholder="Bairro"
                  value={form.bairro}
                  onChange={handleChange}
                />
              </div>

              <h3 className="form-section-title">Características</h3>
              <div className="form-group">
                <Select
                  name="tipo"
                  isSearchable={false}
                  value={form.tipo}
                  onChange={handleSelectChange}
                  options={optionsTipo}
                  classNamePrefix="react-select"
                  placeholder="Tipo"
                  styles={customSelectStyles}
                />
              </div>

              <div className="linha">
                <div className="form-group">
                  <input
                    className={`input-field ${erros.quartos ? "erro" : ""}`}
                    type="number"
                    name="quartos"
                    placeholder="Quartos"
                    value={form.quartos}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <input
                    className={`input-field ${erros.suites ? "erro" : ""}`}
                    type="number"
                    name="suites"
                    placeholder="Suítes"
                    value={form.suites}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <input
                    className={`input-field ${erros.vagas ? "erro" : ""}`}
                    type="number"
                    name="vagas"
                    placeholder="Vagas"
                    value={form.vagas}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <input
                    className={`input-field ${erros.area ? "erro" : ""}`}
                    name="area"
                    type="text"
                    placeholder="Área"
                    value={form.area}
                    onChange={handleChange}
                    onBlur={formatarArea}
                  />
                </div>
              </div>
              <h3 className="form-section-title">Estrutura e comodidades</h3>
      <div className="form-group">
        <div 
          className={`box-estrutura ${estruturaAberta ? "aberto" : ""} ${erros.estrutura ? "erro" : ""}`}
          onClick={() => setEstruturaAberta(!estruturaAberta)}
        >
          <div className="estrutura-label">Estrutura</div>

          <div className="estrutura-tags">
            {form.estrutura.map((item) => (
              <div className="tag-item" key={item}>
                {item}
                <span
                  className="remove-x"
                  onClick={(e) => {
                    e.stopPropagation();
                    removerEstrutura(item);
                  }}
                >
                  X
                </span>
              </div>
            ))}
          </div>

          <span className="arrow"><IoIosArrowDown size={20}/></span>
        </div>

        {estruturaAberta && (
          <div className="estrutura-dropdown">
            {opcoesEstrutura.map((item) => (
              <div
                key={item}
                className={`estrutura-opcao ${form.estrutura.includes(item) ? "selecionado" : ""}`}
                onClick={() => toggleEstrutura(item)}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
              <button className="btn-add" onClick={adicionarImovel} type="button">
                {editandoId ? "Salvar alterações" : "Adicionar Imóvel"}
              </button>
              {editandoId && (
                <button className="btn-cancelar" onClick={() => { setEditandoId(null); setForm({ nome: "", preco: "", imagens: [], quartos: "", suites: "", vagas: "", area: "", bairro: "", cidade: "", estado: null, tipo: null, estrutura: [] }); setErros({}); }} type="button">
                  Cancelar edição
                </button>
              )}
            </div>
            </div>

            <div className="cards-lista">
              <div className="cards-grid">
              <h2 className="cadastrados">Imóveis Cadastrados</h2>
              {imoveis.length === 0 ? (
                <div className="empty-state">
                  <p>Nenhum imóvel cadastrado ainda.</p>
                  <p>Use o formulário acima para adicionar o primeiro.</p>
                </div>
              ) : (
              imoveis.map((item) => (
                <div key={item.id} className="card-wrapper">
                  <Card {...item} onDelete={deletar} onEdit={editar} />
                </div>
              ))
              )}
              </div>
            </div>
            </div>
          </div>
        );
      }
