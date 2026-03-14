import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Catalogo from './Catalogo';
import CadastroImoveis from './CadastroImoveis';
import Detalhes from './Detalhes';
import GaleriaImagens from './GaleriaImagens';
import Login from './Login';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />

        <Route
          path="/cadastroimoveis"
          element={
            <PrivateRoute>
              <CadastroImoveis />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/detalhes/:id" element={<Detalhes />} />
        <Route path="/galeria/:id" element={<GaleriaImagens />} />
        <Route path="*" element={<h1>Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;