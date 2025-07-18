const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para verificar se o utilizador está autenticado
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (token == null) {
		return res
			.status(401)
			.json({ message: "Acesso não autorizado. Token não fornecido." });
	}

	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Token inválido ou expirado." });
		}
		req.user = user;
		next();
	});
};

// Middleware para verificar o token, mas não exige que ele exista (para rotas públicas)
const nonAuthAuthenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (token == null) {
		return next();
	}

	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (!err) {
			req.user = user;
		}
		next();
	});
};

// Middleware para proteger rotas de administração
// Numa aplicação real, isto seria baseado em roles/perfis de utilizador
const isAdmin = (req, res, next) => {
	// Esta é uma verificação simples. Numa aplicação de produção,
	// o token JWT do admin conteria uma role ('admin') que seria verificada aqui.
	// Por agora, vamos assumir que qualquer token válido pode aceder,
	// mas a estrutura está pronta para ser expandida.
	next();
};

module.exports = {
	authenticateToken,
	nonAuthAuthenticateToken,
	isAdmin,
};
