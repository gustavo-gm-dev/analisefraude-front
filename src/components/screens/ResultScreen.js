import React from 'react';
import { getMotivText } from '../../utils/helpers';

const ResultScreen = ({ result, onBack, onLogout }) => {
  if (!result) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-white pb-4">
      <div className="header-gradient">
        <div className="header-top">
          <button className="btn-back" onClick={onBack}>← Voltar</button>
          <span>⚙️</span>
        </div>
      </div>

      <div className="resultado-card">
        <h2 className={`resultado-titulo ${result.ok ? 'aprovado' : 'suspeito'}`}>
          {result.ok ? '✅ Transação Aprovada!' : '⚠️ Transação Suspeita'}
        </h2>
        <p>
          {result.ok ? (
            <>
              <strong>Transação realizada com sucesso!</strong><br />
              <br />
              <strong>ID:</strong> {result.transacaoId}<br />
              <strong>Valor:</strong> R$ {parseFloat(result.valor).toFixed(2)}<br />
              <strong>Data:</strong> {new Date().toLocaleString('pt-BR')}
            </>
          ) : (
            <>
              <strong>Razão da suspensão:</strong><br />
              {getMotivText(result.motivo)}<br />
              <br />
              <p style={{ fontSize: '12px', color: '#999' }}>
                Sua segurança é nossa prioridade. Se acredita que é um erro, entre em contato com o atendimento.
              </p>
            </>
          )}
        </p>
      </div>

      <button className="btn-primary mt-6 mx-4" onClick={onLogout}>
        🏠 Voltar ao Login
      </button>
    </div>
  );
};

export default ResultScreen;
