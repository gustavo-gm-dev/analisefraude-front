# 🏦 AnáliseFraude - Simulador de Fraude Bancária

Um aplicativo mobile web que simula um sistema bancário com análise de fraude em tempo real, desenvolvido em React com design moderno inspirado no Bradesco.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Características](#características)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [APIs](#apis)
- [Sistema de Notificações](#sistema-de-notificações)
- [Validações](#validações)
- [Contribuindo](#contribuindo)

## 🎯 Visão Geral

O **AnáliseFraude** é uma aplicação que demonstra como sistemas bancários modernos detectam padrões suspeitos em transações PIX. O projeto permite simular diferentes cenários de fraude e visualizar em tempo real as decisões de segurança.

**Público-alvo:** Desenvolvedores, analistas de segurança e educadores

## ✨ Características

### 🔐 Autenticação
- Login com CPF e Senha
- Suporte a Login com Biometria
- Gerenciamento de sessão
- Logout seguro

### 💳 Transferências PIX
- Interface intuitiva para transferências
- Validação de valor e chave PIX em tempo real
- Simulação de diferentes comportamentos de dispositivo

### 🚨 Detecção de Fraude
- Análise de padrões de aceleração do dispositivo
- Detecção de velocidade anômala de navegação
- Identificação de comportamento de bot
- Análise de localização e padrões de uso

### 💬 Sistema de Notificações
- Notificações toast com 4 tipos (sucesso, erro, warning, info)
- Auto-desaparição configurável
- Animações suaves

### 📱 Design Responsivo
- Layout tipo smartphone (375x812px)
- Notch e home indicator
- Barra de status funcional
- Design inspirado no Bradesco

## 🛠️ Tecnologias

### Frontend
- **React 18.2.0** - Biblioteca UI
- **React Hooks** - Gerenciamento de estado
- **Context API** - Gerenciamento global
- **CSS3** - Styling e animações

### Backend (Integração)
- API REST em `http://localhost:8080`
- Endpoints:
  - `POST /auth/login` - Autenticação
  - `POST /api/pix/iniciar` - Iniciar fluxo PIX
  - `POST /api/pix/confirmar` - Confirmar transação

### Build & Deploy
- **Create React App** - Scaffolding
- **npm** - Gerenciador de pacotes

## 🚀 Instalação

### Pré-requisitos
- Node.js 14+ instalado
- npm ou yarn
- Backend rodando em `http://localhost:8080`

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/gustavo-gm-dev/analisefraude-front.git
cd analisefraude-front
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure a API**
Edite o arquivo `src/utils/helpers.js` se necessário:
```javascript
const API_URL = 'http://localhost:8080';
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm start
```

5. **Acesse no navegador**
```
http://localhost:3000
```

## 📖 Como Usar

### Login
1. Acesse a tela de login
2. Use os dados padrão:
   - **CPF:** 12345678900
   - **Senha:** 1234
3. Escolha o método de login (Senha ou Biometria)
4. Clique em "Entrar"

### Fazer uma Transferência
1. Na home, clique em "Transferência"
2. Preencha:
   - **Valor:** Ex: 100.00
   - **Chave PIX:** CPF, Email ou Telefone
   - **Tipo de Acesso:** Escolha um cenário para simular
3. Clique em "Confirmar Transação"

### Cenários de Teste
- **📱 Celular na mão (Normal):** Padrão normal de uso
- **🚨 Celular na mesa (Suspeito):** Comportamento anômalo
- **🤖 Emulador/Bot (Suspeito):** Atividade automatizada

### Interpretar Resultado
- **✅ Aprovada:** Transação passou nas validações
- **⚠️ Suspeita:** Bloqueada por motivo de segurança

## 📁 Estrutura do Projeto

```
analisefraude-front/
├── public/
│   └── index.html              # HTML principal
├── src/
│   ├── components/
│   │   ├── AppContainer.js     # Componente raiz
│   │   ├── AppContainer.css    # Estilos do container
│   │   ├── Notification.js     # Toast de notificação
│   │   ├── NotificationContainer.js
│   │   └── screens/
│   │       ├── LoginScreen.js
│   │       ├── HomeScreen.js
│   │       ├── PixScreen.js
│   │       └── ResultScreen.js
│   ├── contexts/
│   │   ├── AuthContext.js      # Contexto de autenticação
│   │   └── NotificationContext.js  # Contexto de notificações
│   ├── utils/
│   │   └── helpers.js          # Validadores e API Service
│   ├── App.js                  # Componente principal
│   ├── index.js                # Entry point
│   └── index.css               # Estilos globais
├── package.json
└── README.md
```

## 🔌 APIs

### POST /auth/login
**Request:**
```json
{
  "cpf": "12345678900",
  "senha": "1234",
  "metodoLogin": "senha"
}
```

**Response (Success):**
```json
{
  "token": "jwt_token_aqui",
  "usuario": { "cpf": "12345678900" }
}
```

**Response (Error):**
```json
{
  "erro": "CPF ou senha incorretos"
}
```

### POST /api/pix/iniciar
**Headers:**
```
Authorization: jwt_token_aqui
```

**Response:**
```json
{
  "sessaoId": "abc123"
}
```

### POST /api/pix/confirmar
**Headers:**
```
Authorization: jwt_token_aqui
Content-Type: application/json
```

**Request:**
```json
{
  "valor": 100.00,
  "chaveDestino": "12345678900",
  "dadosSensor": {
    "acelerometroX": 0.25,
    "acelerometroY": 9.71,
    "acelerometroZ": 0.15
  }
}
```

**Response (Aprovado):**
```json
{
  "transacaoId": "TRX123456",
  "valor": 100.00,
  "status": "aprovada"
}
```

**Response (Suspeito):**
```json
{
  "motivo": "VELOCIDADE_NAVEGACAO_SUSPEITA",
  "status": "suspeita"
}
```

## 💬 Sistema de Notificações

### Usar Notificações em Componentes

```javascript
import { useNotification } from '../contexts/NotificationContext';

function MyComponent() {
  const { success, error, warning, info } = useNotification();

  // Sucesso
  success('✅ Operação realizada!');

  // Erro
  error('❌ Algo deu errado!');

  // Aviso
  warning('⚠️ Atenção!');

  // Info
  info('ℹ️ Informação importante');
}
```

### Tipos de Notificação

| Tipo | Cor | Uso |
|------|-----|-----|
| success | Verde | Ações bem-sucedidas |
| error | Vermelho | Erros e validações |
| warning | Rosa | Avisos |
| info | Vermelho escuro | Informações |

## ✅ Validações

### CPF
- Deve conter 11 dígitos
- Remove caracteres especiais automaticamente

### Senha
- Mínimo de 4 caracteres
- Obrigatória

### Valor PIX
- Deve ser maior que zero
- Apenas números e decimais

### Chave PIX
- Mínimo de 3 caracteres
- Pode ser CPF, Email ou Telefone

### Motivos de Fraude Detectados

| Código | Mensagem |
|--------|----------|
| VELOCIDADE_NAVEGACAO_SUSPEITA | Velocidade de navegação suspeita |
| PADRAO_USO_ANOMALO | Padrão de uso anômalo detectado |
| DETECCAO_BOT | Comportamento de bot ou emulador identificado |
| LOCALIZACAO_INCOMUM | Localização incomum para esta conta |
| MULTIPLAS_TRANSACOES | Múltiplas transações em tempo recorde |
| BIOMETRIA_INVALIDA | Dados biométricos não reconhecidos |
| DISPOSITIVO_NOVO | Acesso de um dispositivo não reconhecido |
| IP_BLOQUEADO | Endereço IP em lista de bloqueio |
| CARTAO_EXPIRADO | Método de pagamento vencido |
| LIMITE_EXCEDIDO | Limite de transações excedido |
| POSICAO_INCOMUM_VALOR_ALTO | Posição incomum para valor alto |

## 🎨 Design & UX

### Paleta de Cores
- **Primária:** #e94560 → #f45c43 (Vermelho/Laranja)
- **Fundo:** #f5f5f5 (Cinza claro)
- **Sucesso:** #11998e → #38ef7d (Verde)
- **Erro:** #eb3349 → #f45c43 (Vermelho)

### Responsividade
- Viewport: 375x812px (iPhone)
- Notch de 30px
- Home indicator de 34px
- Status bar de 44px

## 🔐 Segurança

### Práticas Implementadas
- ✅ Validação de entrada em cliente
- ✅ Token JWT para autenticação
- ✅ Headers de Content-Type
- ✅ CORS configurado no backend
- ✅ Dados sensíveis não armazenados localmente

### Melhorias Recomendadas
- [ ] Adicionar refresh token
- [ ] Implementar rate limiting
- [ ] Usar HTTPS em produção
- [ ] Adicionar CSP headers
- [ ] Implementar 2FA

## 📊 Contextos & Hooks

### AuthContext
```javascript
const { token, user, login, logout } = useAuth();
```

### NotificationContext
```javascript
const { notifications, success, error, warning, info, clearAll } = useNotification();
```

## 🚀 Deploy

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Fazer upload da pasta 'build'
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Performance

- **Lazy Loading:** Componentes carregam sob demanda
- **Memoization:** React.memo para componentes otimizados
- **Code Splitting:** Suportado automaticamente pelo CRA

## 🧪 Testes

Para adicionar testes:

```bash
npm test
```

Exemplo de teste:
```javascript
import { render, screen } from '@testing-library/react';
import LoginScreen from './LoginScreen';

test('renderiza formulário de login', () => {
  render(<LoginScreen />);
  expect(screen.getByText(/acesse sua conta/i)).toBeInTheDocument();
});
```

## 🐛 Troubleshooting

### Erro de Conexão com API
- Verifique se o backend está rodando em `http://localhost:8080`
- Confira CORS no backend

### Notificações não aparecem
- Verifique se `NotificationContainer` está dentro de `NotificationProvider`
- Confira z-index do container

### Estilo não aplicado
- Limpe cache: `npm cache clean --force`
- Reinicie servidor: `npm start`

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para dúvidas ou reportar bugs, abra uma issue no repositório.

- **Email:** dev@analisefraude.com
- **Issues:** [GitHub Issues](https://github.com/gustavo-gm-dev/analisefraude-front/issues)
- **Documentação:** [Wiki](https://github.com/gustavo-gm-dev/analisefraude-front/wiki)

## 🎓 Recursos de Aprendizado

- [React Documentation](https://react.dev)
- [Context API Guide](https://react.dev/reference/react/useContext)
- [React Hooks](https://react.dev/reference/react/hooks)
- [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

---

**Desenvolvido com ❤️ por Gustavo GM Dev**

**Última atualização:** 19 de Novembro de 2025
