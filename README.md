# ⚽ Brasileirão 2026 Simulator

Um simulador interativo do Campeonato Brasileiro 2026, desenvolvido com **React**, **Vite**, **Tailwind CSS** e alimentado pela **Base44**.

![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-yellow?logo=javascript)
![React](https://img.shields.io/badge/React-18+-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.1-purple?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06b6d4?logo=tailwindcss)

## 🎯 Sobre o Projeto

Simulador dinâmico que permite:
- 🏆 Simular diferentes cenários do Brasileirão 2026
- 📊 Visualizar tabela de classificação em tempo real
- 🎮 Interagir com times e resultados
- 📈 Gráficos e análises de desempenho
- 🎨 Interface moderna e responsiva

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/vendasteixeira-wq/brasileir-o-2026-simulator.git
cd brasileir-o-2026-simulator

# 2. Instale as dependências
npm install

# 3. Configure o Base44 CLI
npm install -g base44@latest
```

### Desenvolvimento

```bash
# Modo completo com Base44 backend
base44 dev

# Ou apenas frontend
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

### Build para Produção

```bash
npm run build
npm run preview
```

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - UI library
- **Vite 6** - Build tool & dev server
- **Tailwind CSS 3** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **React Router v6** - Routing
- **React Query** - Data fetching

### Componentes UI
- **Radix UI** - Unstyled, accessible components
- **Shadcn/ui** - High-quality React components
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Formulários & Validação
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Backend
- **Base44 SDK** - Backend as a Service
- **Base44 Vite Plugin** - Integration with Vite

## 📁 Estrutura do Projeto

```
brasileir-o-2026-simulator/
├── src/                    # Código-fonte
├── base44/                 # Configuração Base44
├── public/                 # Arquivos estáticos
├── index.html              # HTML principal
├── vite.config.js          # Configuração Vite
├── tailwind.config.js      # Configuração Tailwind
├── eslint.config.js        # Regras ESLint
├── jsconfig.json           # Configuração JS paths
├── package.json            # Dependências
└── README.md               # Este arquivo
```

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build
npm run lint         # Verifica código com ESLint
npm run lint:fix     # Corrige problemas de linting
npm run typecheck    # Validação de tipos TypeScript
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Base44 Configuration
VITE_BASE44_APP_ID=seu_app_id
VITE_BASE44_APP_BASE_URL=https://seu-app.base44.app
```

### Base44 Config

Edite `base44/config.jsonc` para configurar:
- Comando de servidor frontend
- Variáveis de ambiente
- Rotas de API

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📋 Checklist de Desenvolvimento

- [ ] Fazer lint do código: `npm run lint:fix`
- [ ] Verificar tipos: `npm run typecheck`
- [ ] Testar localmente: `npm run dev`
- [ ] Build para produção: `npm run build`
- [ ] Publicar via Base44: `base44 dashboard open`

## 📚 Documentação

- [Base44 Documentation](https://docs.base44.com)
- [Base44 CLI Reference](https://docs.base44.com/developers/references/cli/commands/introduction)
- [Vite Guide](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)

## 🆘 Suporte

- 📧 Base44 Support: [app.base44.com/support](https://app.base44.com/support)
- 🐛 Issues: [GitHub Issues](https://github.com/vendasteixeira-wq/brasileir-o-2026-simulator/issues)

## 📄 Licença

Este projeto é privado. Para informações sobre licença, entre em contato com o proprietário.

## 👨‍💻 Autor

**vendasteixeira-wq**
- GitHub: [@vendasteixeira-wq](https://github.com/vendasteixeira-wq)

---

<div align="center">
  <strong>Feito com ⚽ para o Brasileirão 2026</strong>
</div>
