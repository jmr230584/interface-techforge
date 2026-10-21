import React, { useState } from 'react';
import { useAuth } from '../../Middleware/AuthMiddleware';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/api';

export const PLogin: React.FC = () => {
    // Controla qual modal está aberto: null, 'login' ou 'cadastro'
    const [modalAtivo, setModalAtivo] = useState<'login' | 'cadastro' | null>(null);

    // Estados dos formulários
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const limparCampos = () => {
        setNome('');
        setEmail('');
        setSenha('');
        setErro('');
        setSucesso('');
    };

    const abrirModal = (tipo: 'login' | 'cadastro') => {
        limparCampos();
        setModalAtivo(tipo);
    };

    const fecharModal = () => {
        limparCampos();
        setModalAtivo(null);
    };

    // Submissão do Formulário de Login
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensagem || 'Credenciais inválidas.');
            }

            if (!data.token) {
                throw new Error('Token não retornado pelo servidor.');
            }

            login(data.token, data.usuario);
            navigate('/home');
        } catch (err: any) {
            setErro(err.message || 'Erro ao realizar login.');
        } finally {
            setCarregando(false);
        }
    };

    // Submissão do Formulário de Cadastro
    const handleCadastroSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        setSucesso('');
        setCarregando(true);

        try {
            const response = await fetch(`${API_URL}/usuario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro ao realizar cadastro.');
            }

            setSucesso('Conta criada com sucesso! Você já pode entrar.');
            setTimeout(() => {
                abrirModal('login');
            }, 1500);
        } catch (err: any) {
            setErro(err.message || 'Erro ao realizar cadastro.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div style={styles.containerWelcome}>
            {/* HERÓI / BOAS-VINDAS */}
            <main style={styles.heroContent}>
                <span style={styles.badge}>Bem-vindo ao TechForge</span>
                <h1 style={styles.tituloHero}>Gestão inteligente de hardware e insumos</h1>
                <p style={styles.subtituloHero}>
                    A plataforma centralizada para controle de estoque, catalogação de produtos e monitoramento de componentes. Autentique-se para ter acesso completo às listagens e operações.
                </p>

                <div style={styles.containerBotoes}>
                    <button
                        onClick={() => abrirModal('login')}
                        style={styles.botaoPrincipal}
                    >
                        Entrar na Plataforma
                    </button>
                    <button
                        onClick={() => abrirModal('cadastro')}
                        style={styles.botaoSecundario}
                    >
                        Cadastre-se
                    </button>
                </div>
            </main>

            {/* MODAL DE AUTENTICAÇÃO / CADASTRO */}
            {modalAtivo && (
                <div style={styles.overlayModal} onClick={fecharModal}>
                    <div style={styles.cardGlassModal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.headerModal}>
                            <h2 style={styles.tituloModal}>
                                {modalAtivo === 'login' ? 'Acessar Conta' : 'Criar Nova Conta'}
                            </h2>
                            <button onClick={fecharModal} style={styles.botaoFechar}>
                                ✕
                            </button>
                        </div>

                        {erro && <div style={styles.alertaErro}>{erro}</div>}
                        {sucesso && <div style={styles.alertaSucesso}>{sucesso}</div>}

                        <form
                            onSubmit={modalAtivo === 'login' ? handleLoginSubmit : handleCadastroSubmit}
                            style={styles.form}
                        >
                            {modalAtivo === 'cadastro' && (
                                <div style={styles.campoGroup}>
                                    <label style={styles.label}>Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        style={styles.input}
                                        placeholder="Seu nome"
                                    />
                                </div>
                            )}

                            <div style={styles.campoGroup}>
                                <label style={styles.label}>E-mail</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={styles.input}
                                    placeholder="seuemail@techforge.com"
                                />
                            </div>

                            <div style={styles.campoGroup}>
                                <label style={styles.label}>Senha</label>
                                <input
                                    type="password"
                                    required
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    style={styles.input}
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={carregando}
                                style={styles.botaoSubmit}
                            >
                                {carregando
                                    ? 'Processando...'
                                    : modalAtivo === 'login' ? 'Entrar' : 'Cadastrar'
                                }
                            </button>
                        </form>

                        <div style={styles.footerModal}>
                            {modalAtivo === 'login' ? (
                                <p style={styles.textoTroca}>
                                    Não possui uma conta?{' '}
                                    <span onClick={() => abrirModal('cadastro')} style={styles.linkTroca}>
                                        Cadastre-se
                                    </span>
                                </p>
                            ) : (
                                <p style={styles.textoTroca}>
                                    Já tem uma conta?{' '}
                                    <span onClick={() => abrirModal('login')} style={styles.linkTroca}>
                                        Faça login
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    containerWelcome: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        padding: '2rem',
        boxSizing: 'border-box',
    },
    heroContent: {
        textAlign: 'center',
        maxWidth: '680px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.2rem',
    },
    badge: {
        background: 'rgba(79, 70, 229, 0.2)',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        color: '#a5b4fc',
        padding: '0.4rem 1rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '500',
        letterSpacing: '0.5px',
    },
    tituloHero: {
        fontSize: '2.8rem',
        color: '#ffffff',
        fontWeight: '700',
        lineHeight: '1.2',
        margin: 0,
    },
    subtituloHero: {
        fontSize: '1.1rem',
        color: 'rgba(255, 255, 255, 0.75)',
        lineHeight: '1.6',
        margin: 0,
    },
    containerBotoes: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem',
    },
    botaoPrincipal: {
        padding: '0.85rem 2rem',
        fontSize: '1rem',
        fontWeight: '600',
        color: '#ffffff',
        backgroundColor: '#4f46e5',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
    },
    botaoSecundario: {
        padding: '0.85rem 2rem',
        fontSize: '1rem',
        fontWeight: '600',
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
    },
    overlayModal: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    cardGlassModal: {
        width: '90%',
        maxWidth: '380px',
        padding: '2rem',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
    },
    headerModal: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    tituloModal: {
        color: '#ffffff',
        fontSize: '1.35rem',
        margin: 0,
    },
    botaoFechar: {
        background: 'transparent',
        border: 'none',
        color: '#ffffff',
        fontSize: '1.2rem',
        cursor: 'pointer',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    campoGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
    },
    label: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: '0.85rem',
    },
    input: {
        padding: '0.75rem',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#ffffff',
        fontSize: '0.95rem',
        outline: 'none',
    },
    botaoSubmit: {
        marginTop: '0.5rem',
        padding: '0.8rem',
        borderRadius: '8px',
        border: 'none',
        background: '#4f46e5',
        color: '#ffffff',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    footerModal: {
        marginTop: '1.2rem',
        textAlign: 'center',
    },
    textoTroca: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.85rem',
        margin: 0,
    },
    linkTroca: {
        color: '#a5b4fc',
        fontWeight: 'bold',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
    alertaErro: {
        background: 'rgba(239, 68, 68, 0.2)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        color: '#fca5a5',
        padding: '0.6rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        textAlign: 'center',
        fontSize: '0.85rem',
    },
    alertaSucesso: {
        background: 'rgba(34, 197, 94, 0.2)',
        border: '1px solid rgba(34, 197, 94, 0.4)',
        color: '#86efac',
        padding: '0.6rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        textAlign: 'center',
        fontSize: '0.85rem',
    },
};