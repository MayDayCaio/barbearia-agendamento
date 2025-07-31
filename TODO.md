# 📝 TODO - Sistema de Agendamento Barbearia

> **Data de criação:** 31 de Julho de 2025  
> **Status do projeto:** Em desenvolvimento  
> **Versão atual:** 2.0

---

## 🚨 **CRÍTICO - Resolver Imediatamente**

### 🔥 Problemas Bloqueantes

- [ ] **Resolver conflitos de merge no `server/index.js`**

  - Arquivo contém marcadores `<<<<<<< HEAD`, `=======`, `>>>>>>> cc3ff78`
  - Servidor pode não funcionar corretamente
  - **Prioridade:** URGENTE

- [ ] **Corrigir autenticação admin insegura**

  - Senha hardcodada "admin" no código
  - Implementar hash + salt da senha
  - Adicionar rate limiting para tentativas de login
  - **Arquivo:** `src/pages/AdminPage.jsx`

- [ ] **Remover IPs hardcodados**
  - IP `31.97.171.200` fixo no código
  - Mover para variáveis de ambiente
  - **Arquivos:** `src/services/api.js`, `src/services/adminApi.js`

---

## 🔐 **SEGURANÇA - Alta Prioridade**

### Autenticação & Autorização

- [ ] **Implementar JWT refresh tokens**
  - Tokens de curta duração + refresh tokens
  - Logout automático em caso de tokens expirados
- [ ] **Middleware de autenticação robusto**
  - Validação de tokens mais rigorosa
  - Headers de segurança (CORS, CSP, etc.)
- [ ] **Rate limiting**
  - Limite de tentativas de login
  - Limite de requests por IP
  - Biblioteca recomendada: `express-rate-limit`

### Validação de Dados

- [ ] **Sanitização de entrada**

  - Validar todos os inputs do frontend
  - Escapar dados antes de inserir no DB
  - Prevenir SQL injection e XSS

- [ ] **Validação de tipos robusta**
  - Schema validation com Joi ou Yup
  - Validação tanto no frontend quanto backend

---

## 🌐 **CONFIGURAÇÃO & AMBIENTE**

### Variáveis de Ambiente

- [ ] **Criar arquivo `.env.example`**

  ```env
  # Banco de Dados
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=seu_usuario
  DB_PASSWORD=sua_senha
  DB_DATABASE=barbearia_db

  # JWT
  JWT_SECRET=seu_jwt_secret_muito_seguro

  # Admin
  ADMIN_PASSWORD=senha_admin_hash

  # API
  PORT=5000
  CORS_ORIGIN=http://localhost:3003

  # Notificações
  WEBHOOK_URL=sua_webhook_url
  ```

- [ ] **Documentar variáveis obrigatórias**

  - Adicionar validação no startup do servidor
  - Mensagens de erro claras para variáveis faltando

- [ ] **Configuração por ambiente**
  - `.env.development`
  - `.env.production`
  - `.env.test`

---

## 🐛 **CORREÇÕES DE BUGS**

### Backend

- [ ] **Corrigir imports duplicados/conflitantes**

  - Verificar todas as importações no `server/index.js`
  - Remover código duplicado dos conflitos de merge

- [ ] **Tratamento de erros melhorado**

  - Middleware global de tratamento de erros
  - Logs estruturados com níveis (info, warn, error)
  - Respostas de erro consistentes

- [ ] **Validação de dados de agendamento**
  - Verificar se horário está disponível antes de confirmar
  - Validar se barbeiro/serviço existem e estão ativos
  - Prevenir agendamentos em horários passados

### Frontend

- [ ] **Estados de loading inconsistentes**
  - Padronizar loading states em todos os componentes
  - Adicionar skeletons ao invés de texto simples
- [ ] **Tratamento de erros da API**
  - Interceptors para requests/responses
  - Mensagens de erro mais amigáveis
  - Retry automático para falhas de rede

---

## 📱 **UX/UI - Melhorias de Experiência**

### Interface do Usuário

- [ ] **Melhorar responsividade mobile**

  - Testar em dispositivos reais
  - Otimizar formulários para touch
  - Melhorar navegação em telas pequenas

- [ ] **Estados de loading mais elegantes**

  - Implementar skeleton loading
  - Animações suaves de transição
  - Progress indicators para processos longos

- [ ] **Feedback visual melhorado**
  - Toasts para ações (sucesso/erro)
  - Confirmações visuais para ações críticas
  - Indicadores de estado mais claros

### Navegação

- [ ] **Breadcrumbs no processo de agendamento**

  - Mostrar progresso atual
  - Permitir voltar a etapas anteriores facilmente

- [ ] **Menu hamburguer para mobile**
  - Navegação mais intuitiva em dispositivos móveis

---

## ⚡ **PERFORMANCE**

### Frontend

- [ ] **Code splitting e lazy loading**

  - Carregar componentes sob demanda
  - Reduzir bundle size inicial
  - Implementar React.lazy() para rotas

- [ ] **Otimização de re-renders**

  - React.memo para componentes pesados
  - useMemo e useCallback onde necessário
  - Análise com React DevTools Profiler

- [ ] **Cache de dados**
  - Cache de serviços e barbeiros
  - Invalidação inteligente de cache
  - Usar React Query ou SWR

### Backend

- [ ] **Otimização de queries**

  - Indexar colunas frequentemente consultadas
  - Evitar N+1 queries
  - Usar prepared statements

- [ ] **Connection pooling otimizado**
  - Configurar pool size adequado
  - Timeout configurações
  - Monitoramento de conexões

---

## 🧪 **TESTES**

### Testes Unitários

- [ ] **Frontend (Jest + React Testing Library)**

  - Testes para componentes críticos
  - Testes para hooks customizados
  - Testes para utils/formatters

- [ ] **Backend (Jest + Supertest)**
  - Testes para rotas da API
  - Testes para controllers
  - Testes para middleware

### Testes de Integração

- [ ] **Testes de fluxos completos**
  - Processo de agendamento completo
  - Autenticação e autorização
  - CRUD de admin

### Testes E2E

- [ ] **Cypress ou Playwright**
  - Fluxos críticos de usuário
  - Testes em diferentes browsers
  - Testes mobile

---

## 📊 **MONITORAMENTO & LOGS**

### Logging

- [ ] **Implementar Winston ou similar**

  - Logs estruturados (JSON)
  - Diferentes níveis de log
  - Rotação de arquivos de log

- [ ] **Request/Response logging**
  - Log de todas as requisições
  - Tempo de resposta
  - Erros com stack trace

### Monitoramento

- [ ] **Health checks**

  - Endpoint `/health` para verificar status
  - Verificação de conectividade com DB
  - Métricas básicas de sistema

- [ ] **Métricas de aplicação**
  - Número de agendamentos por dia
  - Tempo médio de resposta da API
  - Taxa de erro das requisições

---

## 🚀 **NOVAS FUNCIONALIDADES**

### Funcionalidades de Negócio

- [ ] **Sistema de notificações**

  - Email de confirmação/cancelamento
  - SMS/WhatsApp para lembretes
  - Push notifications (PWA)

- [ ] **Sistema de avaliações**

  - Clientes podem avaliar serviços
  - Rating de barbeiros
  - Comentários e feedback

- [ ] **Fila de espera**

  - Lista de espera para horários ocupados
  - Notificação automática quando vaga abre

- [ ] **Agendamentos recorrentes**
  - Permitir agendamentos mensais/semanais
  - Clientes VIP com prioridade

### Admin Avançado

- [ ] **Dashboard com analytics**

  - Gráficos de agendamentos por período
  - Receita por barbeiro/serviço
  - Relatórios exportáveis

- [ ] **Gestão de horários especiais**

  - Feriados e dias de folga
  - Horários especiais por barbeiro
  - Bloqueio de horários específicos

- [ ] **Sistema de desconto/cupons**
  - Cupons promocionais
  - Desconto por fidelidade
  - Campanhas de marketing

---

## 🐳 **DEVOPS & INFRAESTRUTURA**

### Containerização

- [ ] **Docker setup**
  - Dockerfile para frontend e backend
  - docker-compose.yml para desenvolvimento
  - Multi-stage builds para produção

### CI/CD

- [ ] **GitHub Actions**

  - Pipeline de build e testes
  - Deploy automático para staging
  - Deploy manual para produção

- [ ] **Ambientes**
  - Staging environment
  - Production environment
  - Database migrations automatizadas

### Backup & Recovery

- [ ] **Backup automático do banco**
  - Backup diário automatizado
  - Retenção de backups por 30 dias
  - Procedimento de restore documentado

---

## 📚 **DOCUMENTAÇÃO**

### Documentação Técnica

- [ ] **API Documentation com Swagger**

  - Documentar todas as rotas
  - Exemplos de request/response
  - Schema definitions

- [ ] **README.md melhorado**

  - Instruções de instalação completas
  - Guia de desenvolvimento
  - Troubleshooting comum

- [ ] **Comentários no código**
  - JSDoc para funções importantes
  - Comentários explicativos em lógicas complexas

### Documentação de Usuário

- [ ] **Manual do administrador**
  - Como usar o painel admin
  - Gestão de barbeiros e serviços
  - Interpretação de relatórios

---

## 🎨 **MELHORIAS VISUAIS**

### Design System

- [ ] **Padronização de componentes**

  - Button variants consistentes
  - Color palette definida
  - Typography system

- [ ] **Modo escuro/claro**
  - Toggle entre temas
  - Persistir preferência do usuário

### Acessibilidade

- [ ] **WCAG 2.1 compliance**
  - Alt texts para imagens
  - Labels para form inputs
  - Keyboard navigation
  - Screen reader support

---

## 📈 **ANÁLISE & MÉTRICAS**

### Analytics

- [ ] **Google Analytics ou similar**

  - Tracking de conversões
  - Funil de agendamento
  - Análise de abandono

- [ ] **Métricas de negócio**
  - Taxa de conversão de agendamentos
  - Tempo médio no site
  - Dispositivos mais utilizados

---

## 🔧 **FERRAMENTAS DE DESENVOLVIMENTO**

### Quality Assurance

- [ ] **ESLint + Prettier**

  - Configuração consistente
  - Pre-commit hooks com Husky
  - CI checks para code quality

- [ ] **TypeScript (migração gradual)**
  - Começar com arquivos novos
  - Tipagem para APIs
  - Interfaces bem definidas

### Debugging

- [ ] **Sourcemaps configurados**
  - Debug em produção quando necessário
  - Error tracking com Sentry

---

## ✅ **CHECKLIST DE DEPLOY**

### Pré-Deploy

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Banco de dados migrado
- [ ] Testes passando
- [ ] Build de produção funcionando
- [ ] SSL/HTTPS configurado

### Pós-Deploy

- [ ] Health checks passando
- [ ] Logs sem erros críticos
- [ ] Funcionalidades principais testadas
- [ ] Backup automático funcionando
- [ ] Monitoramento ativo

---

## 📅 **CRONOGRAMA SUGERIDO**

### Semana 1-2: Crítico

- Resolver conflitos de merge
- Corrigir segurança básica
- Configurar variáveis de ambiente

### Semana 3-4: Estabilização

- Testes básicos
- Tratamento de erros
- Logging básico

### Semana 5-8: Melhorias

- UX/UI improvements
- Performance optimizations
- Novas funcionalidades básicas

### Semana 9-12: Avançado

- Analytics e monitoramento
- Features avançadas
- Documentação completa

---

**Último update:** 31/07/2025  
**Próxima revisão:** 07/08/2025

---

_Este TODO será atualizado conforme o progresso do projeto. Marque os itens completados com [x] e adicione notas quando necessário._
