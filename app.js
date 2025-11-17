// Espera o HTML carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'http://localhost:8080';

    // Armazenamento "global" do token (só para este protótipo)
    let tokenSessao = null;

    // Referências para todas as telas
    const telas = {
        login: document.getElementById('tela-login'),
        home: document.getElementById('tela-home'),
        pix: document.getElementById('tela-pix'),
        resultado: document.getElementById('tela-resultado')
    };

    // Função para mostrar uma tela e esconder as outras
    function mostrarTela(nomeTela) {
        Object.keys(telas).forEach(key => {
            telas[key].style.display = (key === nomeTela) ? 'block' : 'none';
        });
    }

    // --- LÓGICA DO FLUXO ---

    // 1. LOGIN
    document.getElementById('btn-login').addEventListener('click', async () => {
        const cpf = document.getElementById('cpf').value;
        const senha = document.getElementById('senha').value;
        const metodoLogin = document.getElementById('metodoLogin').value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf, senha, metodoLogin })
            });

            if (!response.ok) {
                alert('Login falhou! Verifique CPF/Senha.');
                return;
            }

            const data = await response.json();
            tokenSessao = data.token; // Salva o token
            console.log('Login OK. Token:', tokenSessao);
            mostrarTela('home');

        } catch (error) {
            console.error('Erro no login:', error);
            alert('Erro ao conectar ao servidor.');
        }
    });

    // 2. IR PARA O PIX (Aqui marcamos o tempo!)
    document.getElementById('btn-ir-pix').addEventListener('click', async () => {
        try {
            await fetch(`${API_URL}/api/pix/iniciar`, {
                method: 'POST',
                headers: { 'Authorization': tokenSessao }
            });
            
            console.log('Iniciou fluxo PIX.');
            mostrarTela('pix');

        } catch (error) {
            console.error('Erro ao iniciar PIX:', error);
        }
    });

    // 3. CONFIRMAR PIX (Onde a mágica acontece)
    document.getElementById('btn-confirmar-pix').addEventListener('click', async () => {
        const valor = parseFloat(document.getElementById('valor').value);
        const chaveDestino = document.getElementById('chavePix').value;
        const simulador = document.getElementById('simuladorSensor').value;

        // Monta o objeto de dados do sensor SIMULADO
        let dadosSensor = {};
        if (simulador === 'normal') {
            dadosSensor = { "acelerometroX": 0.25, "acelerometroY": 9.71, "acelerometroZ": 0.15 };
        } else if (simulador === 'mesa') {
            dadosSensor = { "acelerometroX": 0.0, "acelerometroY": 0.1, "acelerometroZ": 9.81 };
        } else if (simulador === 'bot') {
            dadosSensor = { "acelerometroX": 0.0, "acelerometroY": 0.0, "acelerometroZ": 0.0 };
        }

        const bodyRequest = { valor, chaveDestino, dadosSensor };

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

            // Mostra o resultado
            const titulo = document.getElementById('resultado-titulo');
            const motivo = document.getElementById('resultado-motivo');

            if (response.ok) { // HTTP 200 (Aprovado)
                titulo.textContent = 'Transação Aprovada!';
                titulo.className = 'aprovado';
                motivo.textContent = `ID da Transação: ${data.transacaoId}`;
            } else { // HTTP 400 (Suspeito) ou outro erro
                titulo.textContent = 'Transação Suspeita!';
                titulo.className = 'suspeito';
                motivo.textContent = `Motivo: ${data.motivo}`;
            }
            
            mostrarTela('resultado');

        } catch (error) {
            console.error('Erro ao confirmar PIX:', error);
        }
    });

    // 4. VOLTAR
    document.getElementById('btn-voltar').addEventListener('click', () => {
        tokenSessao = null; // Limpa o token
        mostrarTela('login');
    });

    // Inicia o app na tela de login
    mostrarTela('login');
});