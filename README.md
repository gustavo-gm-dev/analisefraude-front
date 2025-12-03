# 🏦 AnáliseFraude - Simulador de Fraude Bancária

Um aplicativo mobile web que simula um sistema bancário com análise de fraude em tempo real, desenvolvido em React + Tailwind CSS com design moderno inspirado em aplicativos bancários modernos.

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

## 🎯 Visão Geral

O **AnáliseFraude** é uma aplicação que demonstra como sistemas bancários modernos detectam padrões suspeitos em transações PIX. O projeto permite simular diferentes cenários de fraude e visualizar em tempo real as decisões de segurança.

**Público-alvo:** Desenvolvedores, analistas de segurança e educadores

## ✨ Características

### 🔐 Autenticação
- Login com CPF e Senha
- Suporte a Login com Biometria
- Gerenciamento de sessão com JWT
- Logout seguro

### 💳 Transferências PIX
- Interface intuitiva e responsiva
- Validação de valor e chave PIX em tempo real
- Simulação de 3 cenários diferentes:
  - 📱 Celular na mão (Normal)
  - 🚨 Celular na mesa (Suspeito)
  - 🤖 Emulador/Bot (Suspeito)

### 🚨 Detecção de Fraude
- Análise de padrões de aceleração do dispositivo
- Detecção de velocidade anômala de navegação
- Identificação de comportamento de bot
- Análise de localização e padrões de uso

### 💬 Sistema de Notificações
- Toast notifications com 4 tipos (sucesso, erro, warning, info)
- Auto-desaparição configurável
- Animações suaves
- Sistema de contexto para fácil uso

### 📱 Design Responsivo
- Layout tipo smartphone (375x812px)
- Notch e home indicator funcional
- Barra de status com informações
- Tailwind CSS para styling moderno

## 🛠️ Tecnologias

### Frontend
- **React 18.2.0** - Biblioteca UI moderna
- **Tailwind CSS 3.3.0** - Utility-first CSS framework
- **React Hooks** - Gerenciamento de estado
- **Context API** - Gerenciamento global (Auth, Notifications)
- **CSS3** - Animações customizadas

### Backend (Integração)
- API REST em `http://localhost:8080`
- Endpoints:
  - `POST /auth/login` - Autenticação com CPF/Senha
  - `POST /api/pix/iniciar` - Iniciar fluxo PIX (obrigatório)
  - `POST /api/pix/confirmar` - Confirmar transação PIX

### Build & Deploy
- **Create React App** - Scaffolding
- **npm** - Gerenciador de pacotes
- **PostCSS** - Processamento de CSS com Tailwind

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

3. **Configure a API** (se necessário)
Edite `src/utils/helpers.js`:
```javascript
const API_URL = 'http://localhost:8080';
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou npm start
```

5. **Acesse no navegador**
```
http://localhost:3000
```

## 📖 Como Usar

### Login
1. Abra a aplicação
2. Use os dados padrão:
   - **CPF:** 12345678900
   - **Senha:** 1234
3. Clique em "Entrar"

### Fazer uma Transferência
1. Na home, clique no botão "Transferência"
2. Preencha:
   - **Valor:** Ex: 100.00
   - **Chave PIX:** CPF, Email ou Telefone (mín. 3 caracteres)
   - **Tipo de Acesso:** Selecione um cenário
3. Clique em "Confirmar Transação"
4. Veja o resultado (Aprovada ou Suspeita)

### Cenários de Teste
- **📱 Celular na mão (Normal):** Padrão normal com aceleração realista
- **🚨 Celular na mesa (Suspeito):** Comportamento estático
- **🤖 Emulador/Bot (Suspeito):** Valores zerados (emulador)

## 📁 Estrutura do Projeto

```
analisefraude-front/
├── public/
│   └── index.html                 # HTML principal
├── src/
│   ├── components/
│   │   ├── AppContainer.js        # Container principal com navegação
│   │   ├── Notification.js        # Componente de toast
│   │   ├── NotificationContainer.js
│   │   └── screens/
│   │       ├── LoginScreen.js     # Tela de autenticação
│   │       ├── HomeScreen.js      # Menu principal
│   │       ├── PixScreen.js       # Formulário de transferência
│   │       └── ResultScreen.js    # Resultado da transação
│   ├── contexts/
│   │   ├── AuthContext.js         # Contexto de autenticação
│   │   └── NotificationContext.js # Contexto de notificações
│   ├── utils/
│   │   └── helpers.js             # Validadores, mapeadores e API Service
│   ├── App.js                     # Componente raiz
│   ├── index.js                   # Entry point
│   └── index.css                  # Estilos globais + Tailwind
├── package.json
├── tailwind.config.js             # Configuração Tailwind
├── postcss.config.js              # Configuração PostCSS
└── README.md
```

## 🔌 APIs

### POST /auth/login
Autentica o usuário e retorna um JWT token.

**Request:**
```json
{
  "cpf": "12345678900",
  "senha": "1234",
  "metodoLogin": "senha"
}
```

**Response (Sucesso - 200):**
```json
{
  "token": "eyJhbGc...",
  "usuario": { "cpf": "12345678900" }
}
```

**Response (Erro - 401):**
```json
{
  "erro": "CPF ou senha incorretos"
}
```

### POST /api/pix/iniciar
**IMPORTANTE:** Deve ser chamado ANTES de confirmar uma transação!

**Headers:**
```
Authorization: <jwt_token>
```

**Response (Sucesso - 200):**
```json
{}
```

**Response (Erro - 401):**
```json
{
  "erro": "Token inválido"
}
```

### POST /api/pix/confirmar
Confirma a transação e retorna análise de fraude.

**Headers:**
```
Authorization: <jwt_token>
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

**Response (Aprovada - 200):**
```json
{
  "transacaoId": 123,
  "status": "APROVADA",
  "valor": 100.00
}
```

**Response (Suspeita - 200):**
```json
{
  "transacaoId": 456,
  "status": "SUSPEITA",
  "motivo": "DETECCAO_BOT"
}
```

## 💬 Sistema de Notificações

### Usar em Componentes

```javascript
import { useNotification } from '../contexts/NotificationContext';

function MyComponent() {
  const { success, error, warning, info } = useNotification();

  return (
    <button onClick={() => success('✅ Sucesso!')}>
      Notificar
    </button>
  );
}
```

### Tipos Disponíveis

| Tipo | Cor | Ícone | Uso |
|------|-----|-------|-----|
| success | Verde | ✅ | Ações bem-sucedidas |
| error | Vermelho | ❌ | Erros e falhas |
| warning | Rosa | ⚠️ | Avisos |
| info | Azul | ℹ️ | Informações |

## ✅ Validações

### CPF
- Exatamente 11 dígitos
- Remove caracteres especiais automaticamente
- Erro: "CPF deve conter 11 dígitos"

### Senha
- Mínimo de 4 caracteres
- Erro: "Senha deve ter pelo menos 4 caracteres"

### Valor PIX
- Maior que zero
- Aceita decimais
- Erro: "Digite um valor válido maior que zero"

### Chave PIX
- Mínimo de 3 caracteres
- Pode ser CPF, Email ou Telefone
- Erro: "Digite uma chave PIX válida"

## 🎨 Paleta de Cores

Configurada em `tailwind.config.js`:

```javascript
colors: {
  primary: '#e94560',
  'primary-dark': '#f45c43',
  success: '#38ef7d',
  'success-dark': '#11998e',
  error: '#f45c43',
  'error-dark': '#eb3349',
  warning: '#ffd700',
}
```

## 🔐 Segurança

### Implementado
- ✅ Validação de entrada em cliente
- ✅ Autenticação com JWT
- ✅ Headers Content-Type
- ✅ CORS configurável
- ✅ Logout com limpeza de token

### Recomendações
- [ ] Implementar refresh token
- [ ] Usar HTTPS em produção
- [ ] Adicionar rate limiting no backend
- [ ] Implementar CSP headers

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev
npm start

# Build para produção
npm run build

# Testes
npm test

# Eject (não recomendado)
npm run eject
```

## 📊 Motivos de Fraude

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

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm i -g vercel
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

## 🐛 Troubleshooting

### Erro: "Module not found: Can't resolve './App.css'"
- Já foi corrigido! `App.css` foi removido do projeto
- Se persistir, limpe cache: `npm cache clean --force`

### API retorna 403
- Verifique CORS no backend
- Confirme que token é válido
- Veja console do navegador (F12) para mais detalhes

### Notificações não aparecem
- Verifique se `NotificationProvider` envolve `AppContainer`
- Confirme z-index em `index.css` (deve ser `z-[9999]`)

### Fluxo incompleto (erro 400)
- Garanta que chamou `/api/pix/iniciar` ANTES de confirmar
- `HomeScreen.js` já faz isso automaticamente ao clicar em "Transferência"

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Fork do projeto
2. Branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Pull Request

## 📝 Licença

MIT License - veja LICENSE para detalhes

## 📞 Suporte

- **Issues:** [GitHub Issues](https://github.com/gustavo-gm-dev/analisefraude-front/issues)

## 📚 Recursos

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Context API](https://react.dev/reference/react/useContext)
- [React Hooks](https://react.dev/reference/react/hooks)

---

**Desenvolvido com ❤️ por Lucas Rosa**

**Última atualização:** Dezembro de 2025
