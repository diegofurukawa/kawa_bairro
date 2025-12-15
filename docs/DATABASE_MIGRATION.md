# Database Migration Guide

## Problema Resolvido ✅

O problema anterior era que o deploy do Docker estava **apagando todos os registros existentes** toda vez que rodava, em vez de fazer migrations adequadas.

## Solução Implementada

### 1. Scripts de Migration Seguros

- **`yarn db:migrate`** - Executa migrations sem apagar dados existentes
- **`yarn db:import:safe`** - Importa dados apenas se o banco estiver vazio
- **`yarn db:import`** - Importação original (mantida para casos específicos)

### 2. Dockerfile Atualizado

O Dockerfile agora usa:
```dockerfile
CMD ["sh", "-c", "echo '🚀 Starting...' && npx prisma db push && node scripts/migrate-db.js && yarn start"]
```

Em vez de:
```dockerfile
# ANTIGO (problemático)
CMD ["sh", "-c", "echo '🚀 Starting...' && npx prisma db push && yarn db:init && yarn db:import && yarn start"]
```

## Como Usar

### Para Desenvolvimento Local
```bash
# Migration segura (não apaga dados)
yarn db:migrate

# Importação segura (só importa se banco vazio)
yarn db:import:safe
```

### Para Deploy em Produção
```bash
# O Docker agora executa automaticamente:
# 1. npx prisma db push (cria/atualiza schema)
# 2. node scripts/migrate-db.js (migration segura)
# 3. yarn start (inicia aplicação)
```

### Para Importação Forçada (Cuidado!)
```bash
# Só use se quiser apagar dados existentes
yarn db:import
```

## Comportamento dos Scripts

### `migrate-db.js`
- ✅ Verifica se tabelas existem
- ✅ Cria tabelas se não existirem
- ✅ **NÃO apaga dados existentes**
- ✅ Mostra estatísticas do banco

### `safe-import.js`
- ✅ Verifica se já existem dados
- ✅ **NÃO importa se dados já existem**
- ✅ Só importa se banco estiver vazio
- ✅ Preserva dados existentes

### `import-data.js` (original)
- ⚠️ **APAGA todos os dados existentes**
- ⚠️ Importa dados do arquivo carga.txt
- ⚠️ Use apenas quando quiser resetar o banco

## Verificação de Status

Para verificar o estado do banco:
```bash
yarn db:migrate
```

Este comando mostrará:
- Se as tabelas existem
- Quantas quadras e unidades existem
- Se o banco está vazio ou não

## Resumo da Correção

| Antes | Depois |
|-------|--------|
| ❌ Docker apagava dados | ✅ Docker preserva dados |
| ❌ Sempre executava import | ✅ Só executa migration |
| ❌ Perdia registros criados | ✅ Mantém registros existentes |
| ❌ Comportamento destrutivo | ✅ Comportamento seguro |
