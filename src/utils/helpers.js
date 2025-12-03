// Validadores
export const Validators = {
  cpf: (cpf) => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) {
      return { valid: false, message: 'CPF deve conter 11 dígitos' };
    }
    return { valid: true };
  },

  senha: (senha) => {
    if (!senha || senha.length < 4) {
      return { valid: false, message: 'Senha deve ter pelo menos 4 caracteres' };
    }
    return { valid: true };
  },

  valor: (valor) => {
    const numValue = parseFloat(valor);
    if (isNaN(numValue) || numValue <= 0) {
      return { valid: false, message: 'Digite um valor válido maior que zero' };
    }
    return { valid: true };
  },

  chavePix: (chave) => {
    if (!chave || chave.trim().length < 3) {
      return { valid: false, message: 'Digite uma chave PIX válida' };
    }
    return { valid: true };
  }
};

// Mapeamento de motivos de erro
export const MOTIVOS_ERRO = {
  'device_anomaly': 'Padrão de uso anômalo detectado no dispositivo',
  'bot_detection': 'Comportamento de bot ou emulador detectado',
  'unusual_location': 'Localização ou padrão de conexão incomum',
  'rapid_transactions': 'Múltiplas transações em pouco tempo',
  'invalid_biometrics': 'Falha na validação biométrica',
  'VELOCIDADE_NAVEGACAO_SUSPEITA': 'Velocidade de navegação suspeita',
  'PADRAO_USO_ANOMALO': 'Padrão de uso anômalo detectado',
  'DETECCAO_BOT': 'Comportamento de bot ou emulador identificado',
  'LOCALIZACAO_INCOMUM': 'Localização incomum para esta conta',
  'MULTIPLAS_TRANSACOES': 'Múltiplas transações em tempo recorde',
  'BIOMETRIA_INVALIDA': 'Dados biométricos não reconhecidos',
  'DISPOSITIVO_NOVO': 'Acesso de um dispositivo não reconhecido',
  'IP_BLOQUEADO': 'Endereço IP em lista de bloqueio',
  'CARTAO_EXPIRADO': 'Método de pagamento vencido',
  'LIMITE_EXCEDIDO': 'Limite de transações excedido',
  'POSICAO_INCOMUM_VALOR_ALTO': 'Posição incomum para valor alto'
};

export const getMotivText = (motivo) => {
  if (MOTIVOS_ERRO[motivo]) {
    return MOTIVOS_ERRO[motivo];
  }
  
  if (typeof motivo === 'string') {
    return motivo
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/,\s*/g, ', ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return 'Não foi possível completar a transação.';
};

// API Service
const API_URL = 'http://localhost:8080';

export const apiService = {
  login: async (cpf, senha, metodoLogin) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, senha, metodoLogin })
    });

    if (!response.ok) {
      throw new Error(response.status === 401 ? 'CPF ou senha incorretos' : 'Falha ao fazer login');
    }

    return await response.json();
  },

  iniciarPix: async (token) => {
    const response = await fetch(`${API_URL}/api/pix/iniciar`, {
      method: 'POST',
      headers: { 'Authorization': token }
    });

    if (!response.ok) {
      throw new Error(`Erro ao iniciar PIX: ${response.status}`);
    }

    // Tenta fazer parse do JSON, mas se a resposta estiver vazia, retorna sucesso mesmo assim
    try {
      const data = await response.json();
      return data;
    } catch (e) {
      return { success: true };
    }
  },

  confirmarPix: async (token, valor, chaveDestino, dadosSensor) => {
    const payload = { valor, chaveDestino, dadosSensor };
    
    const response = await fetch(`${API_URL}/api/pix/confirmar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    return {
      ok: response.ok,
      data
    };
  }
};
