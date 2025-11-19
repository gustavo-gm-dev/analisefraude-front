// Espera o HTML carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'http://localhost:8080';

    // Armazenamento "global" do token
    let tokenSessao = null;

    // Referências para todas as telas
    const telas = {
        login: document.getElementById('tela-login'),
        home: document.getElementById('tela-home'),
        pix: document.getElementById('tela-pix'),
        resultado: document.getElementById('tela-resultado')
    };

    // ===== SISTEMA DE NOTIFICAÇÕES =====
    const NotificationSystem = {
        container: document.getElementById('notification-container'),
        
        show: function(message, type = 'info', duration = 4000) {
            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };

            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <span class="notification-text">${message}</span>
                <button class="notification-close">✕</button>
            `;

            this.container.appendChild(notification);

            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => {
                this.removeNotification(notification);
            });

            if (duration) {
                setTimeout(() => {
                    this.removeNotification(notification);
                }, duration);
            }

            return notification;
        },

        removeNotification: function(notification) {
            notification.classList.add('removing');
            setTimeout(() => {
                notification.remove();
            }, 300);
        },

        success: function(message, duration) {
            this.show(message, 'success', duration);
        },

        error: function(message, duration) {
            this.show(message, 'error', duration);
        },

        warning: function(message, duration) {
            this.show(message, 'warning', duration);
        },

        info: function(message, duration) {
            this.show(message, 'info', duration);
        },

        clearAll: function() {
            while (this.container.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }
        }
    };

    // ===== VALIDAÇÕES =====
    const Validators = {
        cpf: function(cpf) {
            const cleaned = cpf.replace(/\D/g, '');
            if (cleaned.length !== 11) {
                return { valid: false, message: 'CPF deve conter 11 dígitos' };
            }
            return { valid: true };
        },

        senha: function(senha) {
            if (!senha || senha.length < 4) {
                return { valid: false, message: 'Senha deve ter pelo menos 4 caracteres' };
            }
            return { valid: true };
        },

        valor: function(valor) {
            const numValue = parseFloat(valor);
            if (isNaN(numValue) || numValue <= 0) {
                return { valid: false, message: 'Digite um valor válido maior que zero' };
            }
            return { valid: true };
        },

        chavePix: function(chave) {
            if (!chave || chave.trim().length < 3) {
                return { valid: false, message: 'Digite uma chave PIX válida' };
            }
            return { valid: true };
        }
    };

    // Função para mostrar uma tela e esconder as outras
    function mostrarTela(nomeTela) {
        Object.keys(telas).forEach(key => {
            telas[key].style.display = (key === nomeTela) ? 'block' : 'none';
        });
    }

    // ===== TRATAMENTO DE ERROS COM MAPEAMENTO AMIGÁVEL =====
    function tratarErroAPI(error, contexto) {
        console.error(`Erro em ${contexto}:`, error);

        const mensagens = {
            'TypeError: Failed to fetch': 'Não conseguimos conectar ao servidor. Verifique sua conexão.',
            'SyntaxError': 'Houve um problema ao processar a resposta do servidor.',
            '401': 'Sessão expirada. Por favor, faça login novamente.',
            '403': 'Acesso negado. Verifique suas permissões.',
            '404': 'O servidor não respondeu. Tente novamente mais tarde.',
            '500': 'Erro no servidor. Tente novamente em alguns momentos.'
        };

        let mensagem = mensagens['TypeError: Failed to fetch'] || 'Ocorreu um erro inesperado. Tente novamente.';
        
        for (let [chave, msg] of Object.entries(mensagens)) {
            if (error.toString().includes(chave)) {
                mensagem = msg;
                break;
            }
        }

        NotificationSystem.error(mensagem);
        return mensagem;
    }

    // ===== LÓGICA DO FLUXO =====

    // 1. LOGIN
    document.getElementById('btn-login').addEventListener('click', async () => {
        const cpfInput = document.getElementById('cpf');
        const senhaInput = document.getElementById('senha');
        const metodoLogin = document.getElementById('metodoLogin').value;

        const cpf = cpfInput.value;
        const senha = senhaInput.value;

        // Limpar notificações anteriores
        NotificationSystem.clearAll();

        // Validar CPF
        const validCPF = Validators.cpf(cpf);
        if (!validCPF.valid) {
            cpfInput.classList.add('error');
            NotificationSystem.error('❌ ' + validCPF.message);
            return;
        }
        cpfInput.classList.remove('error');

        // Validar Senha
        const validSenha = Validators.senha(senha);
        if (!validSenha.valid) {
            senhaInput.classList.add('error');
            NotificationSystem.error('❌ ' + validSenha.message);
            return;
        }
        senhaInput.classList.remove('error');

        NotificationSystem.info('🔄 Conectando...', null);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf, senha, metodoLogin })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    NotificationSystem.error('❌ CPF ou senha incorretos. Tente novamente.');
                } else {
                    NotificationSystem.error('❌ Falha ao fazer login. Verifique os dados e tente novamente.');
                }
                return;
            }

            const data = await response.json();
            tokenSessao = data.token;
            NotificationSystem.clearAll();
            NotificationSystem.success('✅ Login realizado com sucesso!', 2000);
            
            setTimeout(() => {
                mostrarTela('home');
            }, 1000);

        } catch (error) {
            tratarErroAPI(error, 'Login');
        }
    });

    // Toggle Saldo
    const btnToggleSaldo = document.getElementById('btn-toggle-saldo');
    if (btnToggleSaldo) {
        btnToggleSaldo.addEventListener('click', () => {
            const saldoValue = document.querySelector('.saldo-value');
            if (saldoValue.textContent === 'R$ 2.500,00') {
                saldoValue.textContent = '••••••';
                btnToggleSaldo.textContent = '👁️‍🗨️ Mostrar';
            } else {
                saldoValue.textContent = 'R$ 2.500,00';
                btnToggleSaldo.textContent = '👁️ Ocultar';
            }
        });
    }

    // 2. IR PARA O PIX
    document.getElementById('btn-ir-pix').addEventListener('click', async () => {
        NotificationSystem.clearAll();
        NotificationSystem.info('⏳ Preparando transferência...', null);

        try {
            const response = await fetch(`${API_URL}/api/pix/iniciar`, {
                method: 'POST',
                headers: { 'Authorization': tokenSessao }
            });

            if (!response.ok && response.status === 401) {
                NotificationSystem.error('❌ Sessão expirada. Faça login novamente.');
                mostrarTela('login');
                return;
            }

            NotificationSystem.clearAll();
            mostrarTela('pix');

        } catch (error) {
            tratarErroAPI(error, 'Iniciar PIX');
        }
    });

    // Botão voltar da tela PIX
    const btnBack = document.querySelector('.btn-back');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            NotificationSystem.clearAll();
            mostrarTela('home');
        });
    }

    // Botão voltar da tela de resultado
    const btnBackResultado = document.getElementById('btn-back-resultado');
    if (btnBackResultado) {
        btnBackResultado.addEventListener('click', () => {
            NotificationSystem.clearAll();
            mostrarTela('home');
        });
    }

    // 3. CONFIRMAR PIX
    document.getElementById('btn-confirmar-pix').addEventListener('click', async () => {
        const valorInput = document.getElementById('valor');
        const chavePixInput = document.getElementById('chavePix');
        
        const valor = valorInput.value;
        const chaveDestino = chavePixInput.value;
        const simulador = document.getElementById('simuladorSensor').value;

        NotificationSystem.clearAll();

        // Validar Valor
        const validValor = Validators.valor(valor);
        if (!validValor.valid) {
            valorInput.classList.add('error');
            NotificationSystem.error('❌ ' + validValor.message);
            return;
        }
        valorInput.classList.remove('error');

        // Validar Chave PIX
        const validChave = Validators.chavePix(chaveDestino);
        if (!validChave.valid) {
            chavePixInput.classList.add('error');
            NotificationSystem.error('❌ ' + validChave.message);
            return;
        }
        chavePixInput.classList.remove('error');

        NotificationSystem.info('🔐 Processando transação...', null);

        // Simular dados do sensor
        let dadosSensor = {};
        if (simulador === 'normal') {
            dadosSensor = { "acelerometroX": 0.25, "acelerometroY": 9.71, "acelerometroZ": 0.15 };
        } else if (simulador === 'mesa') {
            dadosSensor = { "acelerometroX": 0.0, "acelerometroY": 0.1, "acelerometroZ": 9.81 };
        } else if (simulador === 'bot') {
            dadosSensor = { "acelerometroX": 0.0, "acelerometroY": 0.0, "acelerometroZ": 0.0 };
        }

        const bodyRequest = { valor: parseFloat(valor), chaveDestino, dadosSensor };

        try {
            const response = await fetch(`${API_URL}/api/pix/confirmar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': tokenSessao
                },
                body: JSON.stringify(bodyRequest)
            });

            const data = await response.json();

            const titulo = document.getElementById('resultado-titulo');
            const motivo = document.getElementById('resultado-motivo');

            NotificationSystem.clearAll();

            if (response.ok) {
                titulo.textContent = '✅ Transação Aprovada!';
                titulo.className = 'aprovado';
                motivo.innerHTML = `
                    <strong>Transação realizada com sucesso!</strong><br>
                    <br>
                    <strong>ID:</strong> ${data.transacaoId}<br>
                    <strong>Valor:</strong> R$ ${parseFloat(data.valor || valor).toFixed(2)}<br>
                    <strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}
                `;
                NotificationSystem.success('Sua transferência foi aprovada!', 3000);
            } else {
                titulo.textContent = '⚠️ Transação Suspeita';
                titulo.className = 'suspeito';
                
                let motivoTexto = data.motivo || 'Não foi possível completar a transação.';
                
                // Mapeamento completo de motivos com mensagens amigáveis
                const detalhes = {
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

                // Se o motivo está no mapeamento, usa a mensagem amigável
                if (detalhes[data.motivo]) {
                    motivoTexto = detalhes[data.motivo];
                } else if (typeof data.motivo === 'string') {
                    // Converte automaticamente underscores em espaços e deixa em minúsculas
                    motivoTexto = data.motivo
                        .replace(/_/g, ' ')
                        .toLowerCase()
                        .replace(/,\s*/g, ', '); // Garante espaço após vírgula
                    // Capitaliza primeira letra
                    motivoTexto = motivoTexto.charAt(0).toUpperCase() + motivoTexto.slice(1);
                }

                motivo.innerHTML = `
                    <strong>Razão da suspensão:</strong><br>
                    ${motivoTexto}<br>
                    <br>
                    <p style="font-size: 12px; color: #999;">
                        Sua segurança é nossa prioridade. Se acredita que é um erro, entre em contato com o atendimento.
                    </p>
                `;
                NotificationSystem.warning('Sua transação foi bloqueada por segurança', 4000);
            }

            mostrarTela('resultado');

        } catch (error) {
            tratarErroAPI(error, 'Confirmar PIX');
        }
    });

    // 4. VOLTAR
    document.getElementById('btn-voltar').addEventListener('click', () => {
        tokenSessao = null;
        NotificationSystem.clearAll();
        mostrarTela('login');
        
        // Limpar campos de entrada
        document.getElementById('cpf').value = '12345678900';
        document.getElementById('senha').value = '1234';
        document.getElementById('valor').value = '';
        document.getElementById('chavePix').value = '';
    });

    // Inicia o app na tela de login
    mostrarTela('login');
});