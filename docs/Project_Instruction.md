# 🧠 Instruções do Projeto - Project

## 📋 Stack Tecnológica

### Core Technologies
- **Next.js 15** com App Router (sem pages/, com app/)
- **React 18** com Server Components habilitados
- **TypeScript 5.x** com tipagem forte e strict mode
- **Tailwind CSS** configurado via PostCSS
- **SQLite** como banco de dados principal
- **Prisma ORM** para acesso ao banco de dados
- **Zod** para validações e inferência de tipos

### Ferramentas de Desenvolvimento
- **ESLint** + **Prettier** para padronização de código
- **Husky** + **lint-staged** para pre-commit hooks
- **Jest** + **Testing Library** para testes
- **Storybook** para documentação de componentes
- **Prisma Studio** para visualização do banco de dados

## 🏗️ Arquitetura e Estrutura

### Organização de Pastas
```
Projetc/
├── docs/                        # Documentação do projeto
│   ├── Project_Structure.md
│   ├── API_Documentation.md
│   └── Component_Guidelines.md
├── public/                      # Assets estáticos
├── scripts/                     # Scripts de automação
├── src/
│   ├── app/                     # App Router (Next.js 15)
│   │   ├── (dashboard)/         # Route groups
│   │   ├── api/                 # API Routes
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/              # Componentes reutilizáveis
│   │   ├── ui/                  # Componentes básicos (Button, Input, etc.)
│   │   ├── forms/               # Componentes de formulário
│   │   ├── charts/              # Componentes de gráficos
│   │   └── layout/              # Componentes de layout
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # Utilities e configurações
│   │   ├── services/            # Serviços de API
│   │   ├── validations/         # Schemas Zod
│   │   ├── utils/               # Funções utilitárias
│   │   └── constants/           # Constantes do projeto
│   ├── stores/                  # Estado global (Zustand/Context)
│   ├── types/                   # Definições de tipos TypeScript
│   └── styles/                  # Estilos globais e temas
└── tests/                       # Testes unitários e integração
```

## ✅ Convenções de Código

### TypeScript
```typescript
// ✅ SEMPRE usar tipagem explícita
interface UserProps {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ✅ Preferir interfaces para objetos
interface ComponentProps {
  user: UserProps;
  onEdit: (id: string) => void;
  className?: string;
}

// ✅ Usar generics quando necessário
type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
}

// ❌ EVITAR any, as any, ou casting forçado
// const data = response as any; // ❌
```

### Componentes React

#### Server Components (Padrão)
```typescript
// ✅ Server Component - sem 'use client'
interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function UserPage({ params, searchParams }: PageProps) {
  const user = await getUserById(params.id);
  
  return (
    <div className="container mx-auto p-4">
      <UserProfile user={user} />
    </div>
  );
}
```

#### Client Components (Quando Necessário)
```typescript
// ✅ Client Component - apenas quando necessário
'use client';

import { useState, useCallback } from 'react';

interface InteractiveComponentProps {
  initialValue: string;
  onSubmit: (value: string) => Promise<void>;
}

export default function InteractiveComponent({ 
  initialValue, 
  onSubmit 
}: InteractiveComponentProps) {
  const [value, setValue] = useState(initialValue);
  
  const handleSubmit = useCallback(async () => {
    await onSubmit(value);
  }, [value, onSubmit]);
  
  return (
    <form onSubmit={handleSubmit}>
      {/* componente */}
    </form>
  );
}
```

### Validações com Zod
```typescript
// ✅ Schema de validação
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  age: z.number().int().min(18, 'Idade mínima é 18 anos'),
});

// ✅ Inferir tipos do schema
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

// ✅ Usar em API Routes
export async function POST(request: Request) {
  const body = await request.json();
  const validatedData = CreateUserSchema.parse(body);
  
  // Process validated data
}
```

## 🧩 Padrões de Componentização

### Estrutura de Componente
```typescript
// components/UserCard/UserCard.tsx
interface UserCardProps {
  user: User;
  variant?: 'default' | 'compact' | 'detailed';
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function UserCard({ 
  user, 
  variant = 'default',
  onEdit,
  onDelete,
  className 
}: UserCardProps) {
  return (
    <div className={cn('user-card', className)}>
      {/* conteúdo */}
    </div>
  );
}

// components/UserCard/index.ts
export { UserCard } from './UserCard';
export type { UserCardProps } from './UserCard';
```

### Composição de Componentes
```typescript
// ✅ Padrão de composição
export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('card-base', className)}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children }: { children: ReactNode }) {
  return <div className="card-header">{children}</div>;
};

Card.Content = function CardContent({ children }: { children: ReactNode }) {
  return <div className="card-content">{children}</div>;
};

Card.Footer = function CardFooter({ children }: { children: ReactNode }) {
  return <div className="card-footer">{children}</div>;
};

// Uso:
<Card>
  <Card.Header>Título</Card.Header>
  <Card.Content>Conteúdo</Card.Content>
  <Card.Footer>Ações</Card.Footer>
</Card>
```

## 🎨 Padrões de Estilo

### Tailwind CSS
```typescript
// ✅ Classes utilitárias diretas no JSX
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  
// ✅ Uso do cn() para classes condicionais
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  {
    'active-classes': isActive,
    'disabled-classes': isDisabled,
  },
  className
)}>

// ✅ CSS Module apenas para componentes complexos reutilizáveis
// styles/Card.module.css
.card {
  @apply flex flex-col rounded-lg shadow-md;
}

.cardHeader {
  @apply p-4 border-b border-gray-200;
}
```

## 🔧 Custom Hooks

### Estrutura de Hook
```typescript
// hooks/useMORequests.ts
import { useState, useEffect, useCallback } from 'react';
import type { MORequest, MORequestFilters } from '@/types';

interface UseMORequestsReturn {
  requests: MORequest[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateRequest: (id: string, data: Partial<MORequest>) => Promise<void>;
}

export function useMORequests(filters?: MORequestFilters): UseMORequestsReturn {
  const [requests, setRequests] = useState<MORequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await moRequestsService.getAll(filters);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  const updateRequest = useCallback(async (id: string, data: Partial<MORequest>) => {
    try {
      await moRequestsService.update(id, data);
      await fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar');
    }
  }, [fetchRequests]);
  
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);
  
  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
    updateRequest,
  };
}
```

## 🗄️ Padrões de Banco de Dados

### Prisma ORM
```typescript
// ✅ Usar Prisma Client para todas as operações de banco
import { prisma } from '@/lib/prisma';

// Buscar dados com relacionamentos
const customer = await prisma.customer.findUnique({
  where: { customerId: 1 },
  include: {
    addresses: true,
    contracts: true,
    proposals: true
  }
});

// Criar dados com validação
const newCustomer = await prisma.customer.create({
  data: {
    customerName: 'João Silva',
    email: 'joao@example.com',
    document: '12345678901',
    phone: '11999999999',
    customerStatusId: 1
  }
});

// Atualizar dados
const updatedCustomer = await prisma.customer.update({
  where: { customerId: 1 },
  data: { customerName: 'João Santos' }
});

// Deletar dados (soft delete)
const deletedCustomer = await prisma.customer.update({
  where: { customerId: 1 },
  data: { isActive: false }
});
```

### Validação com Zod + Prisma
```typescript
// ✅ Validar dados antes de salvar
import { validatePrismaData, PrismaToZod } from '@/lib/validations/prisma';

const result = validatePrismaData(customerData, PrismaToZod.Customer);
if (!result.success) {
  throw new Error(result.error);
}

const customer = await prisma.customer.create({
  data: result.data
});
```

### Serviços Modernizados
```typescript
// ✅ Usar serviços Prisma modernizados
import { CustomerServicePrisma } from '@/lib/services/customerServicePrisma';

// Buscar clientes com filtros
const customers = await CustomerServicePrisma.findAll({
  search: 'João',
  customer_status_id: 1,
  page: 1,
  limit: 10
});

// Criar cliente
const newCustomer = await CustomerServicePrisma.create({
  customerName: 'João Silva',
  email: 'joao@example.com',
  // ... outros campos
});
```

## 🛡️ Padrões de Segurança

### API Routes
```typescript
// app/api/mo-requests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const user = await auth.getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Rate limiting
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    
    // Validação de parâmetros
    const url = new URL(request.url);
    const filters = GetMORequestsSchema.parse({
      page: url.searchParams.get('page'),
      limit: url.searchParams.get('limit'),
    });
    
    const data = await moRequestsService.getAll(filters);
    
    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
```

## 🧪 Padrões de Teste

### Testes de Componente
```typescript
// __tests__/components/UserCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from '@/components/UserCard';

const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@example.com',
  createdAt: new Date(),
};

describe('UserCard', () => {
  it('deve renderizar informações do usuário', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
  });
  
  it('deve chamar onEdit quando botão editar for clicado', () => {
    const onEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByText('Editar'));
    expect(onEdit).toHaveBeenCalledWith('1');
  });
});
```

### Testes de Hook
```typescript
// __tests__/hooks/useMORequests.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useMORequests } from '@/hooks/useMORequests';

jest.mock('@/lib/services/moRequestsService');

describe('useMORequests', () => {
  it('deve carregar requests inicialmente', async () => {
    const { result } = renderHook(() => useMORequests());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.requests).toHaveLength(0);
    });
  });
});
```

## 📈 Padrões de Performance

### Otimizações React
```typescript
// ✅ Memoização adequada
import { memo, useMemo, useCallback } from 'react';

export const ExpensiveComponent = memo(function ExpensiveComponent({ 
  data, 
  onAction 
}: Props) {
  const processedData = useMemo(() => {
    return data.map(item => expensiveCalculation(item));
  }, [data]);
  
  const handleAction = useCallback((id: string) => {
    onAction(id);
  }, [onAction]);
  
  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} data={item} onAction={handleAction} />
      ))}
    </div>
  );
});
```

### Lazy Loading
```typescript
// ✅ Lazy loading de componentes
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('@/components/HeavyChart'));

export function Dashboard() {
  return (
    <div>
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart data={chartData} />
      </Suspense>
    </div>
  );
}
```

## 📚 Documentação

### JSDoc para Componentes
```typescript
/**
 * Componente para exibir informações de um usuário
 * 
 * @example
 * ```tsx
 * <UserCard 
 *   user={user} 
 *   variant="detailed"
 *   onEdit={(id) => console.log('Edit user:', id)}
 * />
 * ```
 */
export function UserCard({ user, variant = 'default', onEdit }: UserCardProps) {
  // implementação
}
```

### README para Módulos
```markdown
# MORequestsService

Serviço responsável por gerenciar requisições de MO.

## Uso

```typescript
import { moRequestsService } from '@/lib/services/moRequestsService';

const requests = await moRequestsService.getAll();
```

## Métodos

- `getAll(filters?)` - Busca todas as requisições
- `getById(id)` - Busca requisição por ID
- `create(data)` - Cria nova requisição
- `update(id, data)` - Atualiza requisição
- `delete(id)` - Remove requisição
```

## 🚨 Regras Importantes

### ❌ Evitar Sempre
- Tipagem `any` ou `as any`
- `useEffect` desnecessários
- Componentes sem tipagem
- Mutação direta de estado
- CSS inline (exceto casos específicos)
- Importações sem tipagem

### ✅ Sempre Fazer
- Validação de dados com Zod
- Tratamento de erro adequado
- Testes para lógica crítica
- Documentação de componentes complexos
- Code review antes de merge
- Otimização de bundle quando necessário

## 🔄 Processo de Desenvolvimento

1. **Planning**: Definir tipos e interfaces primeiro
2. **Development**: Implementar com tipagem forte
3. **Testing**: Escrever testes unitários
4. **Review**: Code review obrigatório
5. **Deploy**: CI/CD automatizado

## 📋 Checklist de PR

- [ ] Tipagem completa (sem `any`)
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Performance verificada
- [ ] Acessibilidade testada
- [ ] Bundle size verificado