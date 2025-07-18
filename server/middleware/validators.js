const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

const userRegistrationRules = () => [
	body("name", "O nome é obrigatório").notEmpty().trim().escape(),
	body("phone", "O número de telefone é obrigatório")
		.notEmpty()
		.trim()
		.escape(),
	body("password", "A palavra-passe deve ter pelo menos 6 caracteres").isLength(
		{ min: 6 }
	),
];

const appointmentRules = () => [
	body("service_id", "O ID do serviço é obrigatório").notEmpty(),
	body("barber_id", "O ID do barbeiro é obrigatório").notEmpty(),
	body("appointment_time", "A data e hora do agendamento são obrigatórias")
		.isISO8601()
		.toDate(),
	// Validação condicional para clientes não autenticados
	body("customer_name")
		.if(body("user_id").not().exists())
		.notEmpty()
		.withMessage("O nome do cliente é obrigatório"),
	body("customer_phone")
		.if(body("user_id").not().exists())
		.notEmpty()
		.withMessage("O telefone do cliente é obrigatório"),
];

const serviceRules = () => [
	body("name", "O nome do serviço é obrigatório").notEmpty().trim().escape(),
	body("price", "O preço deve ser um número válido").isFloat({ gt: 0 }),
	body("duration", "A duração deve ser um número inteiro positivo").isInt({
		gt: 0,
	}),
];

const barberRules = () => [
	body("name", "O nome do barbeiro é obrigatório").notEmpty().trim().escape(),
];

module.exports = {
	handleValidationErrors,
	userRegistrationRules,
	appointmentRules,
	serviceRules,
	barberRules,
};
