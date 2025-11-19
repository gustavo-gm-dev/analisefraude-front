import React, { useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { Validators, apiService } from '../../utils/helpers';

const LoginScreen = ({ onLoginSuccess }) => {
  const [cpf, setCpf] = useState('12345678900');
  const [senha, setSenha] = useState('1234');
  const [metodoLogin, setMetodoLogin] = useState('senha');
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotification();
  const { login } = useAuth();

  const handleLogin = async () => {
    const validCPF = Validators.cpf(cpf);
    if (!validCPF.valid) {
      error('❌ ' + validCPF.message);
      return;
    }

    const validSenha = Validators.senha(senha);
    if (!validSenha.valid) {
      error('❌ ' + validSenha.message);
      return;
    }

    setLoading(true);

    try {
      const data = await apiService.login(cpf, senha, metodoLogin);
      login(data.token, { cpf });
      success('✅ Login realizado com sucesso!', 2000);
      setTimeout(onLoginSuccess, 1000);
    } catch (err) {
      error('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="header-gradient">
        <div className="header-top">
          <span className="logo">AnáliseFraude</span>
          <span>⚙️</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 gap-7">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">🔐 Acesse sua Conta</h2>
        
        <input
          type="text"
          placeholder="CPF (ex: 12345678900)"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base bg-white text-gray-700 transition-all focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary focus:ring-opacity-10 placeholder-gray-400"
        />
        
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base bg-white text-gray-700 transition-all focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary focus:ring-opacity-10 placeholder-gray-400"
        />
        
        <select 
          value={metodoLogin} 
          onChange={(e) => setMetodoLogin(e.target.value)}
          className="w-full px-4 py-4 border border-gray-200 rounded-xl text-base bg-white text-gray-700 transition-all focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary focus:ring-opacity-10"
        >
          <option value="senha">🔒 Login com Senha</option>
          <option value="biometria">👆 Login com Biometria</option>
        </select>
        
        <button 
          className="btn-primary mt-2"
          onClick={handleLogin} 
          disabled={loading}
        >
          {loading ? '⏳ Conectando...' : 'Entrar'}
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
