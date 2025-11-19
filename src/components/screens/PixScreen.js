import React, { useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { Validators, apiService } from '../../utils/helpers';

const PixScreen = ({ onBack, onConfirm }) => {
  const [valor, setValor] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [simulador, setSimulador] = useState('normal');
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotification();
  const { token } = useAuth();

  const handleConfirm = async () => {
    const validValor = Validators.valor(valor);
    if (!validValor.valid) {
      error('❌ ' + validValor.message);
      return;
    }

    const validChave = Validators.chavePix(chavePix);
    if (!validChave.valid) {
      error('❌ ' + validChave.message);
      return;
    }

    setLoading(true);

    let dadosSensor = {};
    if (simulador === 'normal') {
      dadosSensor = { acelerometroX: 0.25, acelerometroY: 9.71, acelerometroZ: 0.15 };
    } else if (simulador === 'mesa') {
      dadosSensor = { acelerometroX: 0.0, acelerometroY: 0.1, acelerometroZ: 9.81 };
    } else if (simulador === 'bot') {
      dadosSensor = { acelerometroX: 0.0, acelerometroY: 0.0, acelerometroZ: 0.0 };
    }

    try {
      const { ok, data } = await apiService.confirmarPix(
        token,
        parseFloat(valor),
        chavePix,
        dadosSensor
      );

      onConfirm({
        ok,
        valor,
        transacaoId: data.transacaoId,
        motivo: data.motivo
      });
    } catch (err) {
      error('❌ Erro ao processar PIX');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white pb-4">
      <div className="header-gradient">
        <div className="header-top">
          <button className="btn-back" onClick={onBack}>← Voltar</button>
          <span>⚙️</span>
        </div>
        <div className="page-title">Transferência PIX</div>
      </div>

      <div className="form-container">
        <div className="form-group">
          <label>Valor</label>
          <input
            type="number"
            placeholder="R$ 0,00"
            step="0.01"
            min="0"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base bg-white text-gray-700 transition-all focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary focus:ring-opacity-10 placeholder-gray-400"
          />
        </div>

        <div className="form-group">
          <label>Chave PIX</label>
          <input
            type="text"
            placeholder="CPF, Email ou Telefone"
            value={chavePix}
            onChange={(e) => setChavePix(e.target.value)}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base bg-white text-gray-700 transition-all focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary focus:ring-opacity-10 placeholder-gray-400"
          />
        </div>

        <div className="info-box">
          <p><strong>Simule diferentes cenários:</strong></p>
        </div>

        <div className="form-group">
          <label>Tipo de Acesso</label>
          <select 
            value={simulador} 
            onChange={(e) => setSimulador(e.target.value)}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base bg-white text-gray-700 transition-all focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary focus:ring-opacity-10"
          >
            <option value="normal">📱 Celular na mão (Normal)</option>
            <option value="mesa">🚨 Celular na mesa (Suspeito)</option>
            <option value="bot">🤖 Emulador/Bot (Suspeito)</option>
          </select>
        </div>

        <button className="btn-primary mt-2" onClick={handleConfirm} disabled={loading}>
          {loading ? '🔐 Processando...' : '✔️ Confirmar Transação'}
        </button>
      </div>
    </div>
  );
};

export default PixScreen;
