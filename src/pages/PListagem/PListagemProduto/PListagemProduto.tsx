// src/pages/PListagem/PListagemProduto/PListagemProduto.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProdutoRequests } from "../../../fetch/ProdutoRequests";
import type { ProdutoDTO } from "../../../dto/ProdutoDTO";
import "./PListagemProduto.css";

export function PListagemProduto() {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();

  // Estados do Modal de Edição
  const [produtoEditando, setProdutoEditando] = useState<ProdutoDTO | null>(null);
  const [nomeEdit, setNomeEdit] = useState("");
  const [precoEdit, setPrecoEdit] = useState<number | string>("");
  const [salvando, setSalvando] = useState(false);

  const carregarProdutos = async () => {
    setCarregando(true);
    setErro(false);
    try {
      const dados = await ProdutoRequests.listarTodos();
      setProdutos(dados);
    } catch (error) {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleAbrirEditar = (prod: ProdutoDTO) => {
    setProdutoEditando(prod);
    setNomeEdit(prod.nome || "");
    setPrecoEdit(prod.preco_unitario ?? "");
  };

  const handleFecharModal = () => {
    setProdutoEditando(null);
    setNomeEdit("");
    setPrecoEdit("");
  };

  const handleSalvarAtualizacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produtoEditando) return;

    const id = (produtoEditando as any).id_produto ?? (produtoEditando as any).id;
    if (!id) return;

    setSalvando(true);

    try {
      const dadosAtualizados: any = {
        ...produtoEditando,
        id_produto: id,
        id: id,
        nome: nomeEdit,
        preco_unitario: Number(precoEdit)
      };

      const sucesso = await ProdutoRequests.atualizar(dadosAtualizados);

      if (sucesso) {
        setProdutos((prev) =>
          prev.map((p) => {
            const pId = (p as any).id_produto ?? (p as any).id;
            return pId === id ? { ...p, nome: nomeEdit, preco_unitario: Number(precoEdit) } : p;
          })
        );
        handleFecharModal();
      } else {
        alert("Erro ao atualizar o produto.");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const sucesso = await ProdutoRequests.remover(id);
      if (sucesso) {
        setProdutos((prev) => prev.filter((p) => ((p as any).id_produto ?? (p as any).id) !== id));
      } else {
        alert("Erro ao excluir o produto.");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor para exclusão.");
    }
  };

  if (carregando) return <p className="mensagem-status">Carregando produtos...</p>;
  if (erro) return <p className="mensagem-erro">Erro ao conectar com o servidor na porta 3000.</p>;

  return (
    <div className="container-listagem">
      <div className="header-listagem">
        <h2>Listagem de Produtos</h2>
        <button 
          className="btn-cadastrar" 
          onClick={() => navigate("/cadastro/produto")}
        >
          + Cadastrar Produto
        </button>
      </div>

      {produtos.length === 0 ? (
        <p className="mensagem-status">Nenhum produto registrado.</p>
      ) : (
        <div className="tabela-responsive">
          <table className="tabela-listagem">
            <thead>
              <tr>
                <th>ID PRODUTO</th>
                <th>NOME</th>
                <th>PREÇO</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((prod, index) => {
                const idProd = (prod as any).id_produto ?? (prod as any).id;

                return (
                  <tr key={idProd ?? index}>
                    <td>{idProd ?? "-"}</td>
                    <td>{prod.nome}</td>
                    <td>R$ {Number(prod.preco_unitario || 0).toFixed(2)}</td>
                    <td>
                      <div className="coluna-acoes">
                        <button 
                          className="btn-acao btn-atualizar"
                          onClick={() => handleAbrirEditar(prod)}
                        >
                          Atualizar
                        </button>
                        <button 
                          className="btn-acao btn-deletar"
                          onClick={() => handleDeletar(idProd)}
                        >
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Bloquinho / Modal de Edição */}
      {produtoEditando && (
        <div className="modal-overlay" onClick={handleFecharModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Atualizar Produto #{(produtoEditando as any).id_produto ?? (produtoEditando as any).id}</h3>
              <button className="btn-fechar" onClick={handleFecharModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSalvarAtualizacao}>
              <div className="form-group">
                <label>Nome do Produto:</label>
                <input
                  type="text"
                  value={nomeEdit}
                  onChange={(e) => setNomeEdit(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Preço Unitário:</label>
                <input
                  type="number"
                  step="0.01"
                  value={precoEdit}
                  onChange={(e) => setPrecoEdit(e.target.value)}
                  required
                />
              </div>

              <div className="modal-acoes">
                <button type="button" className="btn-cancelar" onClick={handleFecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar" disabled={salvando}>
                  {salvando ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PListagemProduto;