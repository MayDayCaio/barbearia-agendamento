# 🔥 AÇÃO IMEDIATA REQUERIDA

## ⚠️ PROBLEMA CRÍTICO - Resolver AGORA

### 1. Conflitos de Merge no Servidor

**Arquivo:** `server/index.js`  
**Status:** 🚨 BLOQUEANTE

O arquivo contém marcadores de conflito de Git não resolvidos:

```
<<<<<<< HEAD
=======
>>>>>>> cc3ff78
```

**Ação:**

1. Abrir `server/index.js`
2. Resolver todos os conflitos de merge
3. Testar se o servidor inicia corretamente
4. Fazer commit das correções

---

### 2. Segurança Comprometida

**Arquivo:** `src/pages/AdminPage.jsx`  
**Status:** 🚨 ALTA PRIORIDADE

Senha de admin hardcodada no código:

```javascript
if (password === "admin") {
	// Qualquer pessoa pode acessar painel admin
}
```

**Ação:**

1. Implementar hash da senha no backend
2. Remover validação do frontend
3. Usar variável de ambiente para senha

---

### 3. IPs Hardcodados

**Arquivos:** `src/services/api.js`, `src/services/adminApi.js`  
**Status:** 🔶 MÉDIA PRIORIDADE

IP fixo `31.97.171.200` no código:

```javascript
const API_BASE_URL = "http://31.97.171.200:5000/api";
```

**Ação:**

1. Criar variável de ambiente `VITE_API_URL`
2. Atualizar todos os arquivos de API
3. Documentar no `.env.example`

---

## ✅ CHECKLIST PRIMEIRA SEMANA

- [ ] **DIA 1:** Resolver conflitos de merge
- [ ] **DIA 2:** Corrigir autenticação admin
- [ ] **DIA 3:** Remover IPs hardcodados
- [ ] **DIA 4:** Criar `.env.example` completo
- [ ] **DIA 5:** Testar todas as funcionalidades

---

## 🛠️ COMANDOS ÚTEIS

```bash
# Verificar conflitos
git status
grep -r "<<<<<<< HEAD" .

# Testar servidor
cd server
npm start

# Testar frontend
npm run dev
```

---

**IMPORTANTE:** Não fazer deploy até resolver estes problemas críticos!
