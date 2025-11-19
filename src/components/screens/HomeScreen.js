import React, { useState } from 'react';

const HomeScreen = ({ onGoToPix, onLogout }) => {
  const [saldoVisivel, setSaldoVisivel] = useState(true);

  return (
    <div className="flex flex-col h-full bg-white pb-4">
      <div className="header-gradient">
        <div className="header-top">
          <div>
            <div className="text-sm opacity-90 font-medium">Olá! 👋</div>
            <div className="text-base font-bold">Bem-vindo</div>
          </div>
          <span className="text-2xl">🔔</span>
        </div>

        <div className="saldo-container">
          <div className="saldo-label">Meu saldo</div>
          <div className="saldo-value">
            {saldoVisivel ? 'R$ 2.500,00' : '••••••'}
          </div>
          <button
            className="btn-toggle-saldo"
            onClick={() => setSaldoVisivel(!saldoVisivel)}
          >
            {saldoVisivel ? '👁️ Ocultar' : '👁️‍🗨️ Mostrar'}
          </button>
        </div>
      </div>

      <div className="menu-grid">
        <button className="menu-item" onClick={onGoToPix}>
          <div className="menu-icon">💸</div>
          <div className="menu-label">Transferência</div>
        </button>
        <button className="menu-item">
          <div className="menu-icon">💳</div>
          <div className="menu-label">Cartão</div>
        </button>
        <button className="menu-item">
          <div className="menu-icon">💰</div>
          <div className="menu-label">Poupança</div>
        </button>
        <button className="menu-item">
          <div className="menu-icon">➕</div>
          <div className="menu-label">Mais</div>
        </button>
      </div>

      <div className="section-title">Favoritos</div>
      <div className="favoritos-grid">
        <div className="favorito-item">
          <div className="favorito-icon">💸</div>
          <div className="favorito-label">Transferência</div>
        </div>
        <div className="favorito-item">
          <div className="favorito-icon">📊</div>
          <div className="favorito-label">Investimentos</div>
        </div>
        <div className="favorito-item">
          <div className="favorito-icon">💎</div>
          <div className="favorito-label">Seguros</div>
        </div>
        <div className="favorito-item">
          <div className="favorito-icon">👤</div>
          <div className="favorito-label">Perfil</div>
        </div>
      </div>

      <div className="promo-card">
        <div className="promo-content">
          <h3>🎉 Oferta Especial</h3>
          <p>Aproveite cashback de até 10% em suas transferências!</p>
        </div>
        <div className="promo-icon">💳</div>
      </div>

      <button className="btn-logout" onClick={onLogout}>🚪 Sair</button>
    </div>
  );
};

export default HomeScreen;
