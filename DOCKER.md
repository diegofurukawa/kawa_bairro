# Docker - MeuBairro Cataguá

## Como usar

### Construir e rodar
```bash
docker-compose up --build
```

### Apenas rodar (se já construído)
```bash
docker-compose up
```

### Parar
```bash
docker-compose down
```

### Ver logs
```bash
docker-compose logs -f
```

## Variáveis de ambiente

As variáveis estão no arquivo `docker.env`:
- `DATABASE_URL`: URL do banco de dados
- `NODE_ENV`: Ambiente (production)

## Porta

A aplicação roda na porta **3000**.
