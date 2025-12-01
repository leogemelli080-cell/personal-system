# Guia de Implantação (Deployment) - VYK System

Este guia explica como colocar o sistema VYK online para que você possa acessá-lo de qualquer lugar e compartilhar o link com seus alunos.

Recomendamos o uso da **Vercel** ou **Netlify**, que são gratuitos para projetos pessoais e muito fáceis de configurar.

## Opção 1: Vercel (Recomendado)

1.  Crie uma conta em [vercel.com](https://vercel.com).
2.  Instale a Vercel CLI (opcional) ou conecte seu GitHub.
    *   **Via GitHub (Mais fácil):**
        1.  Faça o push do seu código para um repositório no GitHub.
        2.  No painel da Vercel, clique em "Add New..." -> "Project".
        3.  Importe o repositório do VYK System.
    *   **Via Upload Manual (Se não usar GitHub):**
        1.  Instale o Node.js no seu computador.
        2.  Abra o terminal na pasta do projeto.
        3.  Execute `npx vercel` e siga as instruções (diga "Yes" para tudo).

3.  **Configurar Variáveis de Ambiente:**
    *   Durante a importação (ou nas configurações do projeto após criar), vá em **Settings** -> **Environment Variables**.
    *   Adicione as seguintes variáveis (copie do seu arquivo `.env`):
        *   `VITE_SUPABASE_URL`: (Sua URL do Supabase)
        *   `VITE_SUPABASE_PUBLISHABLE_KEY`: (Sua chave pública do Supabase)

4.  **Deploy:**
    *   A Vercel fará o build e fornecerá um link (ex: `vyk-system.vercel.app`).

## Opção 2: Netlify

1.  Crie uma conta em [netlify.com](https://netlify.com).
2.  Arraste a pasta `dist` (gerada após rodar `npm run build`) para o painel da Netlify, OU conecte seu GitHub.
3.  **Configurar Variáveis de Ambiente:**
    *   Vá em **Site configuration** -> **Environment variables**.
    *   Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.

## Acesso Local (Na sua rede Wi-Fi)

Se você apenas quer acessar pelo celular na mesma casa:

1.  O servidor já está configurado para aceitar conexões externas.
2.  Descubra o IP do seu computador (no Mac: Preferências do Sistema -> Rede).
3.  No celular, digite: `http://SEU_IP_DO_COMPUTADOR:8080` (ex: `http://192.168.1.5:8080`).

## Observação Importante

Para que o login e o banco de dados funcionem corretamente na versão online, você precisa adicionar o domínio do seu site (ex: `https://seu-projeto.vercel.app`) na lista de **Redirect URLs** do Supabase:

1.  Vá no painel do Supabase -> Authentication -> URL Configuration.
2.  Adicione a URL do seu site em "Redirect URLs".
