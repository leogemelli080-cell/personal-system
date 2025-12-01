# VLK - Value Your Key

## 🎯 Sistema de Avaliação Física Completo

Sistema moderno e completo de avaliação física com acompanhamento de medidas antropométricas, cálculos automáticos, dashboard de evolução e análise de composição corporal.

![VLK Logo](./src/assets/logo-vyk.png)

## ✨ Funcionalidades

### 📊 Avaliação Física Completa
- **Dados Pessoais**: Nome, data, idade, sexo, altura e peso
- **Circunferências**: 14 medidas corporais diferentes (pescoço, ombros, tórax, cintura, etc.)
- **Dobras Cutâneas**: 8 pontos de medição para análise de composição corporal
- **Cálculos Automáticos**:
  - IMC (Índice de Massa Corporal)
  - Percentual de Gordura (Fórmula de Jackson & Pollock - 7 dobras)
  - Massa Magra
  - Massa Gorda
  - Densidade Corporal

### 📈 Dashboard de Performance
- **Gráficos Evolutivos**: Visualize sua progressão ao longo do tempo
  - Evolução de peso
  - Variação do percentual de gordura
  - Ganho/perda de massa magra e massa gorda
- **Cards de Métricas**: Dados da última avaliação com histórico
- **Análise Detalhada**:
  - Composição corporal completa
  - Principais circunferências
  - Progresso total entre primeira e última avaliação
  - Comparação de medidas ao longo do tempo

### 🎨 Design Futurista
- Tema escuro com gradientes roxo, azul e preto
- Efeitos de estrelas e nebulosas no background
- Animações suaves e transições fluidas
- Interface responsiva para mobile e desktop
- Logo VLK integrada em todas as páginas

## 🚀 Tecnologias Utilizadas

### Frontend
- **React** 18.3.1 - Biblioteca JavaScript para UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de UI modernos
- **React Router** - Navegação entre páginas
- **React Query** - Gerenciamento de estado e cache
- **Recharts** - Gráficos e visualizações

### Backend (Lovable Cloud)
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security (RLS)** - Segurança de dados

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ e npm

### Passos

1. **Clone o repositório**
```bash
git clone <YOUR_GIT_URL>
cd vlk-sistema
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

O arquivo `.env` é gerado automaticamente pelo Lovable Cloud e contém:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

4. **Execute o projeto em desenvolvimento**
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:8080`

## 🏗️ Estrutura do Projeto

```
vlk-sistema/
├── src/
│   ├── assets/           # Imagens e recursos estáticos
│   │   └── logo-vyk.png
│   ├── components/       # Componentes reutilizáveis
│   │   ├── ui/          # Componentes shadcn/ui
│   │   ├── Layout.tsx   # Layout principal com navegação
│   │   └── EvolutionChart.tsx  # Gráficos de evolução
│   ├── hooks/           # Custom React Hooks
│   │   ├── use-toast.ts
│   │   └── useAvaliacoes.ts  # Hook para gerenciar avaliações
│   ├── pages/           # Páginas da aplicação
│   │   ├── Avaliacao.tsx     # Página de avaliação física
│   │   ├── Dashboard.tsx     # Dashboard de visualização
│   │   └── NotFound.tsx      # Página 404
│   ├── integrations/    # Integrações (Supabase)
│   │   └── supabase/
│   │       ├── client.ts     # Cliente Supabase (auto-gerado)
│   │       └── types.ts      # Tipos TypeScript (auto-gerado)
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Ponto de entrada
│   └── index.css        # Estilos globais e design system
├── supabase/
│   └── migrations/      # Migrações do banco de dados
├── index.html
├── tailwind.config.ts   # Configuração Tailwind
├── vite.config.ts       # Configuração Vite
└── README.md
```

## 🗄️ Banco de Dados

### Tabelas

#### `avaliacoes`
Armazena todas as avaliações físicas completas:
- Dados pessoais (nome, idade, sexo, altura, peso)
- Cálculos automáticos (IMC, BF%, massa magra/gorda)
- 14 circunferências corporais
- 8 dobras cutâneas

#### `fotos_avaliacoes`
Armazena fotos das avaliações:
- Referência à avaliação
- Posição (frente, lateral, costas)
- URL da foto

### Políticas RLS
Todas as tabelas possuem Row Level Security habilitado com políticas públicas para este sistema.

## 🎨 Design System

### Cores VLK
- **Primary**: Roxo vibrante (`#8b5cf6`)
- **Secondary**: Azul elétrico (`#3b82f6`)
- **Accent**: Roxo claro (`#a855f7`)
- **Background**: Preto espacial com gradientes
- **Success**: Verde (`#10b981`)
- **Destructive**: Vermelho (`#ef4444`)

### Efeitos Visuais
- Background com estrelas animadas
- Gradientes de nebulosa (roxo e azul)
- Cards com backdrop blur
- Sombras com glow effect
- Transições suaves

## 📱 Funcionalidades Futuras

- [ ] Upload e comparação de fotos das avaliações
- [ ] Gerador de dietas baseado na composição corporal
- [ ] Gráficos de circunferências específicas
- [ ] Exportação de relatórios em PDF
- [ ] Sistema de autenticação de usuários
- [ ] Comparação entre períodos específicos
- [ ] Metas e objetivos personalizados
- [ ] Notificações de progresso

## 🤝 Contribuindo

Este é um projeto criado com Lovable. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto foi desenvolvido como sistema proprietário VLK - Value Your Key.

## 🔗 Links Úteis

- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 👨‍💻 Suporte

Para suporte e dúvidas sobre o sistema VLK, entre em contato através dos canais oficiais.

---

**VLK - Value Your Key** | Sistema de Avaliação Física Profissional
