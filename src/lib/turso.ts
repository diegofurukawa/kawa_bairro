import { createClient } from '@libsql/client';

// Configuração do cliente Turso
export const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
});

// Função para executar queries no Turso
export async function executeQuery(sql: string, params?: any[]) {
  try {
    const result = await tursoClient.execute(sql, params);
    return result;
  } catch (error) {
    console.error('Erro ao executar query no Turso:', error);
    throw error;
  }
}

// Função para executar queries de transação
export async function executeTransaction(queries: { sql: string; params?: any[] }[]) {
  try {
    const result = await tursoClient.batch(queries);
    return result;
  } catch (error) {
    console.error('Erro ao executar transação no Turso:', error);
    throw error;
  }
}

// Exemplo de uso para criar tabelas
export async function initializeDatabase() {
  const createQuadraTable = `
    CREATE TABLE IF NOT EXISTS quadra (
      quadra_id INTEGER PRIMARY KEY AUTOINCREMENT,
      quadra_name TEXT UNIQUE NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createUnidadeTable = `
    CREATE TABLE IF NOT EXISTS unidade (
      unidade_id INTEGER PRIMARY KEY AUTOINCREMENT,
      unidade_numero TEXT UNIQUE NOT NULL,
      quadra_id INTEGER NOT NULL,
      mora TEXT,
      contato TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quadra_id) REFERENCES quadra(quadra_id) ON DELETE CASCADE
    )
  `;

  try {
    await executeQuery(createQuadraTable);
    await executeQuery(createUnidadeTable);
    console.log('Tabelas criadas com sucesso no Turso');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
}
