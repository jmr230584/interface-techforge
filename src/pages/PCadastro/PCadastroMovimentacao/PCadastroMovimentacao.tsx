import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovimentacaoRequests } from '../../../fetch/MovimentacaoRequests';
import { ProdutoRequests } from '../../../fetch/ProdutoRequests';
import type { ProdutoDTO } from '../../../dto/ProdutoDTO';
import './PCadastroMovimentacao.css';

interface FormMovimentacao {
    id_produto: number | string;
    tipo: 'ENTRADA' | 'SAIDA';
    quantidade: number;
    observacao: string;
}

export function PCadastroMovimentacao() {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
    const [formData, setFormData] = useState<FormMovimentacao>({
        id_produto: '',
        tipo: 'ENTRADA',
        quantidade: 0,
        observacao: ''
    });

    // Carrega a lista de produtos para o <select>
    useEffect(() => {
        async function carregarProdutos() {
            try {
                const dados = await ProdutoRequests.listarTodos();
                setProdutos(dados);
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
            }
        }
        carregarProdutos();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantidade' 
                ? Number(value) 
                : name === 'id_produto' 
                    ? Number(value) || '' 
                    : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.id_produto) {
            alert("Selecione um produto válido.");
            return;
        }

        if (formData.quantidade <= 0) {
            alert("Informe uma quantidade válida maior que zero.");
            return;
        }

        const sucesso = await MovimentacaoRequests.cadastrar({
            id_produto: Number(formData.id_produto),
            tipo: formData.tipo,
            quantidade: formData.quantidade,
            observacao: formData.observacao || null
        });

        if (sucesso) {
            alert("Movimentação registrada com sucesso!");
            navigate('/movimentacoes');
        }
    };

    return (
        <main className="form-main-container">
            <div className="form-wrapper">
                <form onSubmit={handleSubmit} className="form-card">
                    <h1 className="form-title">Cadastrar Movimentação</h1>

                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label htmlFor="id_produto">Produto</label>
                            <select
                                name="id_produto"
                                id="id_produto"
                                required
                                value={formData.id_produto}
                                onChange={handleChange}
                            >
                                <option value="">-- Selecione o Produto --</option>
                                {produtos.map((prod) => {
                                    const id = (prod as any).id_produto ?? (prod as any).id;
                                    return (
                                        <option key={id} value={id}>
                                            {prod.nome} (Atual: {prod.quantidade_disponivel ?? 0})
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="tipo">Tipo de Movimentação</label>
                                <select
                                    name="tipo"
                                    id="tipo"
                                    required
                                    value={formData.tipo}
                                    onChange={handleChange}
                                >
                                    <option value="ENTRADA">ENTRADA (+ Estoque)</option>
                                    <option value="SAIDA">SAÍDA (- Estoque)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="quantidade">Quantidade</label>
                                <input
                                    type="number"
                                    name="quantidade"
                                    id="quantidade"
                                    min="1"
                                    required
                                    value={formData.quantidade || ''}
                                    onChange={handleChange}
                                    placeholder="Ex: 10"
                                />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="observacao">Observação</label>
                            <textarea
                                name="observacao"
                                id="observacao"
                                rows={3}
                                value={formData.observacao}
                                onChange={handleChange}
                                placeholder="Motivo da entrada/saída (opcional)..."
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-submit">
                            CADASTRAR MOVIMENTAÇÃO
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/movimentacoes')}
                            className="btn-cancel"
                        >
                            VOLTAR PARA LISTAGEM
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default PCadastroMovimentacao;