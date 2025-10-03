# Sistema de Gestão de Restaurante

Sistema de gestão para restaurante desenvolvido como trabalho acadêmico utilizando Next.js e TypeScript.

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em seu computador:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)
- [Git](https://git-scm.com/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (para banco de dados local)

## 🗄️ Configuração do MongoDB Local

### 1. Instalar MongoDB Community Server

1. Acesse: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Escolha a versão para Windows
3. Execute o instalador
4. Durante a instalação, marque a opção "Install MongoDB as a Service"

### 2. Verificar se o MongoDB está rodando

Abra o **Prompt de Comando** ou **PowerShell** como **administrador** e execute:

```powershell
# Verificar se o serviço está ativo
net start MongoDB

# Se não estiver ativo, inicie o serviço
net start MongoDB
```

### 3. Instalar MongoDB Compass (Opcional - Interface Gráfica)

1. Baixe em: [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
2. Instale e conecte com: `mongodb://localhost:27017`
3. Útil para visualizar os dados do banco

## 🚀 Como inicializar o projeto

### 1. Clone o repositório

```powershell
git clone https://github.com/mapirpg/gestao_restaurante.git
cd gestao_restaurante
```

### 2. Instale as dependências

```powershell
npm install
```

### 3. Configurar variáveis de ambiente

O arquivo [.env.local](.env.local) já está configurado com:

```env
MONGODB_URI=mongodb://localhost:27017/gestao_restaurante
```

### 4. Execute o projeto em modo de desenvolvimento

```powershell
npm run dev
```

### 5. Testar a conexão com o banco de dados

1. Acesse: [http://localhost:3000/api/test-connection](http://localhost:3000/api/test-connection)
2. Você deve ver uma resposta JSON como:

```json
{
  "message": "Conexão bem-sucedida!",
  "database": "gestao_restaurante",
  "collections": []
}
```

### 6. Acesse o sistema

Abra seu navegador e acesse: [http://localhost:3000](http://localhost:3000)

## 🧪 Testando as APIs

### APIs disponíveis

- **GET** `/api/test-connection` - Testa conexão com MongoDB
- **GET** `/api/clientes` - Lista todos os clientes
- **POST** `/api/clientes` - Cria um novo cliente
- **GET** `/api/clientes/[id]` - Busca cliente por ID
- **PUT** `/api/clientes/[id]` - Atualiza cliente
- **DELETE** `/api/clientes/[id]` - Remove cliente
- **GET** `/api/produtos` - Lista produtos
- **POST** `/api/produtos` - Cria produto

### Exemplo: Criar um cliente

```powershell
# Usando curl (se disponível)
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999",
    "endereco": "Rua das Flores, 123"
  }'
```

Ou use ferramentas como **Postman** ou **Insomnia** para testar as APIs.

## 📝 Scripts disponíveis

- `npm run dev` - Executa o projeto em modo de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm start` - Executa o projeto em modo de produção
- `npm run lint` - Executa o linter para verificar o código

## 🛠️ Tecnologias utilizadas

- **Next.js 15.5.4** - Framework React
- **React 19.1.0** - Biblioteca para interface
- **TypeScript** - Tipagem estática
- **MongoDB** - Banco de dados NoSQL
- **ESLint** - Linting de código

## 📁 Estrutura do projeto

```
├── src/
│   ├── database/           # Configuração do banco de dados
│   │   ├── connection.ts   # Conexão com MongoDB
│   │   └── models.ts       # Modelos/interfaces TypeScript
│   ├── pages/              # Páginas do sistema
│   │   ├── api/            # Rotas da API
│   │   │   ├── clientes/   # APIs de clientes
│   │   │   ├── produtos/   # APIs de produtos
│   │   │   └── test-connection.ts # Teste de conexão
│   │   ├── _app.tsx        # Configuração global da aplicação
│   │   └── index.tsx       # Página inicial
│   └── styles/             # Arquivos de estilo
├── public/                 # Arquivos estáticos
├── .env.local              # Variáveis de ambiente (MongoDB URI)
├── .next/                  # Arquivos gerados pelo Next.js
└── ...
```

## ❗ Problemas comuns

### MongoDB não está rodando

```powershell
# Verificar status do serviço
sc query MongoDB

# Iniciar serviço como administrador
net start MongoDB

# Se não funcionar, reiniciar o serviço
net stop MongoDB
net start MongoDB
```

### Porta 27017 ocupada

```powershell
# Verificar o que está usando a porta
netstat -ano | findstr :27017

# Matar processo se necessário (substitua <PID> pelo número do processo)
taskkill /PID <PID> /F
```

### Erro de conexão: "ECONNREFUSED"

1. Verifique se o MongoDB está rodando
2. Confirme que a porta 27017 está disponível
3. Verifique se não há firewall bloqueando

### Erro de dependências

Se houver problemas com as dependências, tente:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Problemas com TypeScript

Certifique-se de que todas as tipagens estão corretas. O projeto está configurado com TypeScript strict mode.

## 📚 Recursos úteis

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do React](https://react.dev/)
- [Documentação do TypeScript](https://www.typescriptlang.org/docs/)
- [Documentação do MongoDB](https://docs.mongodb.com/)
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Interface gráfica

## 📞 Suporte

Se encontrar problemas:

1. Verifique se todos os pré-requisitos estão instalados
2. Teste a conexão com o banco em `/api/test-connection`
3. Consulte a seção de problemas comuns
4. Entre em contato com os membros do grupo

## 🔍 Monitoramento do Banco

Para visualizar os dados criados:

1. Abra o MongoDB Compass
2. Conecte em: `mongodb://localhost:27017`
3. Acesse o banco: `gestao_restaurante`
4. Explore as coleções: `clientes`, `produtos`, `pedidos`

O banco de dados `gestao_restaurante` será criado automaticamente na primeira inserção de dados!
