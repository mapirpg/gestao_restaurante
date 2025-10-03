# Sistema de Gestão de Restaurante

Sistema de gestão para restaurante desenvolvido como trabalho acadêmico utilizando Next.js e TypeScript.

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em seu computador:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)
- [Git](https://git-scm.com/)

## 🚀 Como inicializar o projeto

### 1. Clone o repositório

```powershell
git clone <URL_DO_REPOSITORIO>
cd gestao_restaurante
```

### 2. Instale as dependências

```powershell
npm install
```

### 3. Gere a build de produção

```powershell
npm run build
```

### 4. Execute o projeto

```powershell
npm start
```

### 5. Acesse o sistema

Abra seu navegador e acesse: [http://localhost:3000](http://localhost:3000)

## 🛠️ Tecnologias utilizadas

- **Next.js 15.5.4** - Framework React
- **React 19.1.0** - Biblioteca para interface
- **TypeScript** - Tipagem estática
- **ESLint** - Ferramenta de análise de código que identifica padrões problemáticos e garante qualidade do código

## 🔍 ESLint - Verificação de Código

O ESLint está configurado para manter a qualidade do código. Para verificar se seu código está seguindo os padrões:

```powershell
npm run lint
```

O ESLint irá:

- Identificar erros de sintaxe
- Verificar padrões de código
- Sugerir melhorias
- Garantir consistência no projeto

## 📁 Estrutura do projeto

```
├── src/
│   ├── pages/          # Páginas do sistema
│   │   ├── api/        # Rotas da API
│   │   ├── _app.tsx    # Configuração global da aplicação
│   │   └── index.tsx   # Página inicial
│   └── styles/         # Arquivos de estilo
├── public/             # Arquivos estáticos
├── .next/              # Arquivos gerados pelo Next.js
└── ...
```

## ❗ Problemas comuns

### Erro de dependências

Se houver problemas com as dependências, tente:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```
