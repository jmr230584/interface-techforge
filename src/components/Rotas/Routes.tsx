import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../Middleware/AuthMiddleware";
import { PWelcome } from "../../pages/PWelcome/PWelcome";
import { PLogin } from "../../pages/PLogin/PLogin";
import PHome from "../../pages/PHome/PHome";
import PListagemProduto from "../../pages/PListagem/PListagemProduto/PListagemProduto";
import PCadastroProduto from "../../pages/PCadastro/PCadastroProduto/PCadastroProduto";
import PListagemCategoria from "../../pages/PListagem/PListagemCategoria/PlistagemCategoria";
import PCadastroCategoria from "../../pages/PCadastro/PCadastroCategoria/PCadastroCategoria";
import PListagemMovimentacao from "../../pages/PListagem/PListagemMovimentacao/PListagemMovimentacao";
import PCadastroMovimentacao from "../../pages/PCadastro/PCadastroMovimentacao/PCadastroMovimentacao";

function RotaProtegida({ children }: { children: React.ReactElement }) {
  const { autenticado, loading } = useAuth();

  if (loading) return null;
  
  return autenticado ? children : <Navigate to="/" replace />;
}

export function Rotas() {
  return (
    <Routes>
      <Route path="/" element={<PWelcome />} />
      <Route path="/login" element={<PLogin />} />
      <Route path="/home" element={<RotaProtegida><PHome /></RotaProtegida>}/>
      <Route path="/produtos" element={<RotaProtegida><PListagemProduto /></RotaProtegida>}/>
      <Route path="/cadastro/produto" element={<RotaProtegida><PCadastroProduto /></RotaProtegida>}/>
      <Route path="/categorias" element={<RotaProtegida><PListagemCategoria /></RotaProtegida>}/>
      <Route path="/cadastro/categoria" element={<RotaProtegida><PCadastroCategoria /></RotaProtegida>}/>
      <Route path="/movimentacao" element={<RotaProtegida><PListagemMovimentacao /></RotaProtegida>}/>
      <Route path="/movimentacoes" element={<RotaProtegida><PListagemMovimentacao /></RotaProtegida>}/>
      <Route path="/cadastro/movimentacao" element={<RotaProtegida><PCadastroMovimentacao /></RotaProtegida>} />
      <Route path="/cadastro/movimentacoes" element={<RotaProtegida><PCadastroMovimentacao /></RotaProtegida>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Rotas;