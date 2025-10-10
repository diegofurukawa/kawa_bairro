# 🏠 MeuBairro - Jardim das Oliveiras

Sistema de cadastro de unidades e moradores para o bairro Jardim das Oliveiras.

## 🚀 Tecnologias

- **Next.js 15** com App Router
- **React 18** com Server Components
- **TypeScript** com tipagem forte
- **Tailwind CSS** para estilização
- **Prisma ORM** com SQLite
- **Zod** para validações
- **Radix UI** para componentes acessíveis

## 📋 Funcionalidades

- ✅ Cadastro de quadras
- ✅ Cadastro de unidades
- ✅ Gerenciamento de moradores (chips/tags)
- ✅ Gerenciamento de contatos (chips/tags)
- ✅ Compartilhamento via Web Share API
- ✅ Interface responsiva
- ✅ Validação de dados
- ✅ Tipagem TypeScript completa

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd meubairro-jd-oliveiras
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

4. **Execute o projeto**
```bash
npm run dev
```

## 📊 Estrutura do Banco

### Tabela `quadra`
- `quadra_id` (PK)
- `quadra_name` (TEXT, UPPER CASE, unique)
- `createdAt`
- `updatedAt`

### Tabela `unidade`
- `unidade_id` (PK)
- `unidade_numero` (TEXT, unique)
- `quadra_id` (FK)
- `mora` (JSON - array de strings)
- `contato` (JSON - array de strings)
- `createdAt`
- `updatedAt`

## 🎯 Como Usar

1. **Acesse a aplicação** em `http://localhost:3000`
2. **Preencha o formulário** com:
   - Número da unidade
   - Seleção/criação de quadra
   - Lista de moradores (chips)
   - Lista de contatos (chips)
3. **Compartilhe** com seus vizinhos usando o botão de compartilhamento

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build
npm start

# Banco de dados
npm run db:generate  # Gerar cliente Prisma
npm run db:push      # Aplicar mudanças no schema
npm run db:studio    # Abrir Prisma Studio
npm run db:seed      # Popular banco com dados iniciais

# Qualidade de código
npm run lint         # Executar ESLint
npm test            # Executar testes
```

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona bem em:
- 📱 Dispositivos móveis
- 📱 Tablets
- 💻 Desktops

## 🔒 Validações

- **Quadra**: Nome obrigatório, máximo 100 caracteres
- **Unidade**: Número obrigatório, único, máximo 20 caracteres
- **Moradores**: Mínimo 1, máximo 10
- **Contatos**: Mínimo 1, máximo 5

## 🌟 Características

- **Tipagem forte** com TypeScript
- **Validação robusta** com Zod
- **Interface moderna** com Tailwind CSS
- **Componentes acessíveis** com Radix UI
- **Performance otimizada** com Next.js 15
- **Código limpo** seguindo padrões SOLID

## 📄 Licença

Este projeto é de uso interno para o bairro Jardim das Oliveiras.
