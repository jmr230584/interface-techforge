import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MovimentacaoRequests } from "../../../fetch/MovimentacaoRequests";
import type MovimentacaoDTO from "../../../dto/MovimentacaoDTO";
import "./PListagemMovimentacao.css";

export function PListagemMovimentacao() {
    const [movimentacoes, setMovimentacoes] = useState<MovimentacaoDTO[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);
    const navigate = useNavigate();

    // Estados do Modal de Edição
    const [movimentacaoEditando, setMovimentacaoEditando] = useState<MovimentacaoDTO | null>(null);
    const [tipoEdit, setTipoEdit] = useState<'ENTRADA' | 'SAIDA'>("ENTRADA");
    const [quantidadeEdit, setQuantidadeEdit] = useState<number | string>("");
    const [observacaoEdit, setObservacaoEdit] = useState("");
    const [salvando, setSalvando] = useState(false);

    const carregarMovimentacoes = async () => {
        setCarregando(true);
        setErro(false);
        try {
            const dados = await MovimentacaoRequests.listarTodas();
            setMovimentacoes(dados);
        } catch (error) {
            setErro(true);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarMovimentacoes();
    }, []);

    const handleAbrirEditar = (mov: MovimentacaoDTO) => {
        setMovimentacaoEditando(mov);
        setTipoEdit(mov.tipo);
        setQuantidadeEdit(mov.quantidade);
        setObservacaoEdit(mov.observacao || "");
    };

    const handleFecharModal = () => {
        setMovimentacaoEditando(null);
        setTipoEdit("ENTRADA");
        setQuantidadeEdit("");
        setObservacaoEdit("");
    };

    const handleSalvarAtualizacao = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!movimentacaoEditando) return;

        const id = (movimentacaoEditando as any).id_movimentacao ?? (movimentacaoEditando as any).id;
        if (!id) return;

        setSalvando(true);

        try {
            const dadosAtualizados: any = {
                ...movimentacaoEditando,
                id_movimentacao: id,
                id: id,
                tipo: tipoEdit,
                quantidade: Number(quantidadeEdit),
                observacao: observacaoEdit || null
            };

            const sucesso = await MovimentacaoRequests.atualizar(dadosAtualizados);

            if (sucesso) {
                // Recarrega a lista para manter os dados sincronizados
                await carregarMovimentacoes();
                handleFecharModal();
            }
        } catch (err) {
            alert("Erro ao conectar com o servidor.");
        } finally {
            setSalvando(false);
        }
    };

    const handleDeletar = async (id?: number) => {
        if (!id) return;
        if (!window.confirm("Tem certeza que deseja excluir esta movimentação? O estoque será estornado automaticamente.")) return;

        try {
            const sucesso = await MovimentacaoRequests.remover(id);
            if (sucesso) {
                setMovimentacoes((prev) => 
                    prev.filter((m) => ((m as any).id_movimentacao ?? (m as any).id) !== id)
                );
            }
        } catch (err) {
            alert("Erro ao conectar com o servidor para exclusão.");
        }
    };

    const formatarData = (dataStr?: string | Date) => {
        if (!dataStr) return "-";
        const data = new Date(dataStr);
        return data.toLocaleString("pt-BR");
    };

    if (carregando) return <p className="mensagem-status">Carregando movimentações...</p>;
    if (erro) return <p className="mensagem-erro">Erro ao conectar com o servidor na porta 3000.</p>;

    return (
        <div className="container-listagem">
            <div className="header-listagem">
                <h2>Histórico de Movimentações</h2>
                <button 
                    className="btn-cadastrar" 
                    onClick={() => navigate("/cadastro/movimentacao")}
                >
                    + Nova Movimentação
                </button>
            </div>

            {movimentacoes.length === 0 ? (
                <p className="mensagem-status">Nenhuma movimentação registrada.</p>
            ) : (
                <div className="tabela-responsive">
                    <table className="tabela-listagem">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>PRODUTO (ID)</th>
                                <th>TIPO</th>
                                <th>QTD</th>
                                <th>DATA</th>
                                <th>OBSERVAÇÃO</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimentacoes.map((mov, index) => {
                                const idMov = (mov as any).id_movimentacao ?? (mov as any).id;

                                return (
                                    <tr key={idMov ?? index}>
                                        <td>{idMov ?? "-"}</td>
                                        <td>{mov.id_produto}</td>
                                        <td>
                                            <span className={`tag-tipo ${mov.tipo.toLowerCase()}`}>
                                                {mov.tipo}
                                            </span>
                                        </td>
                                        <td>{mov.quantidade}</td>
                                        <td>{formatarData(mov.data_movimentacao)}</td>
                                        <td>{mov.observacao || "-"}</td>
                                        <td>
                                            <div className="coluna-acoes">
                                                <button 
                                                    className="btn-acao btn-atualizar"
                                                    onClick={() => handleAbrirEditar(mov)}
                                                >
                                                    Atualizar
                                                </button>
                                                <button 
                                                    className="btn-acao btn-deletar"
                                                    onClick={() => handleDeletar(idMov)}
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

            {/* Modal de Edição de Movimentação */}
            {movimentacaoEditando && (
                <div className="modal-overlay" onClick={handleFecharModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Atualizar Movimentação #{(movimentacaoEditando as any).id_movimentacao ?? (movimentacaoEditando as any).id}</h3>
                            <button className="btn-fechar" onClick={handleFecharModal}>&times;</button>
                        </div>
                        
                        <form onSubmit={handleSalvarAtualizacao}>
                            <div className="form-group">
                                <label>Tipo de Movimentação:</label>
                                <select 
                                    value={tipoEdit} 
                                    onChange={(e) => setTipoEdit(e.target.value as 'ENTRADA' | 'SAIDA')}
                                    required
                                >
                                    <option value="ENTRADA">ENTRADA (+ Estoque)</option>
                                    <option value="SAIDA">SAÍDA (- Estoque)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Quantidade:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantidadeEdit}
                                    onChange={(e) => setQuantidadeEdit(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Observação:</label>
                                <input
                                    type="text"
                                    value={observacaoEdit}
                                    onChange={(e) => setObservacaoEdit(e.target.value)}
                                    placeholder="Observação opcional..."
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

export default PListagemMovimentacao;