import { Link } from 'react-router-dom';
import { Boxes, Cpu, Zap, ArrowRight } from 'lucide-react';
import './BoasVindas.css';

export function BoasVindas() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="hero-content">
              <h1 className="hero-title">
                Gerenciamento de Hardware <span className="hero-highlight">TechForge</span>
              </h1>
              <p className="hero-description">
                Sistema completo para controle de estoque, peças e componentes de alta performance.
              </p>
              
              <div className="hero-buttons">
                {/* Botão de navegação para a listagem */}
                <Link to="/produtos" className="btn-primary flex items-center justify-center gap-2">
                  <span>Ir para Listagem de Produtos</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destaques rápidos */}
      <section className="features-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><Boxes /></div>
              <h3 className="feature-title">Controle de Estoque</h3>
              <p className="feature-description">Acompanhe a quantidade disponível e mínima em tempo real.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Cpu /></div>
              <h3 className="feature-title">Categorização</h3>
              <p className="feature-description">Organize processadores, placas e periféricos com facilidade.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Zap /></div>
              <h3 className="feature-title">Acesso Rápido</h3>
              <p className="feature-description">Gerencie entradas e saídas diretamente no catálogo.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}