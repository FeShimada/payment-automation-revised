# QuickPay

## Descrição
Sistema de automação de pagamentos integrado com o Mercado Pago.

## Pré-requisitos
- Node.js
- PostgreSQL
- NPM ou Yarn

## Configuração Inicial

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd quickpay
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env` baseado no `.env.example`
- Preencha as seguintes variáveis:

### Mercado Pago
```env
ACCESS_TOKEN=seu_access_token_do_mercado_pago
PUBLIC_KEY=sua_public_key_do_mercado_pago
```
Para obter estas credenciais:
1. Acesse [mercadopago.com.br/developers](https://mercadopago.com.br/developers)
2. Vá para "Suas integrações"
3. Selecione sua aplicação
4. Nas credenciais, você encontrará o ACCESS_TOKEN e PUBLIC_KEY

### Configuração da Aplicação
```env
APP_URL=http://localhost:3000
NODE_ENV=development
```

### WebSocket
```env
WEB_SOCKET_URL=ws://localhost:3000
HTTP_ACCESS_KEY=sua_chave_de_acesso
```

### Banco de Dados
```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/quickpay"
```

## Configuração do Banco de Dados

1. Atualize o banco de dados com a estrutura do Prisma:
```bash
npx prisma generate
npx prisma migrate dev
```

2. (Opcional) Rode o seed para criar o usuário admin inicial:
```bash
npx prisma db seed
```

Credenciais do usuário admin padrão:
- Email: admin@email.com
- Senha: 123123
- CPF: 00758352905

## Comandos Disponíveis

### Desenvolvimento
- **npm run dev** - Inicia o servidor de desenvolvimento (atualiza em tempo real)
- **npm run build** - Gera a build do projeto
- **npm start** - Inicia o projeto em modo produção

### Prisma
- **npx prisma studio** - Interface visual do banco de dados
- **npx prisma db push** - Atualiza o banco com a estrutura do schema
- **npx prisma generate** - Atualiza as entidades do Prisma
- **npx prisma migrate dev** - Gera nova migration
- **npx prisma migrate reset** - Reseta o banco e aplica migrations e seed

## Docker (Opcional)

Para rodar com Docker:

1. Primeiro execute apenas o banco de dados:
```bash
docker-compose up database
```

2. Configure o arquivo .env para o Docker:
```env
DATABASE_URL="postgres://postgres:postgres@database:5432/quickpay"
```

3. Build e execução:
```bash
docker build -t quickpay .
docker run -p 3001:3001 quickpay
```

## Observações Importantes
- Nunca compartilhe ou comite seu arquivo `.env`
- Mantenha o `.env.example` atualizado com as variáveis necessárias (sem valores)
- Em produção, use valores diferentes e mais seguros
- Configure as variáveis de ambiente no seu serviço de hospedagem
