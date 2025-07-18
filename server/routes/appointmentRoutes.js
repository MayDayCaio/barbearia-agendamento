const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController.js");
const publicController = require("../controllers/publicController.js");
const {
	authenticateToken,
	nonAuthAuthenticateToken,
} = require("../middleware/auth.js");
const {
	appointmentRules,
	handleValidationErrors,
} = require("../middleware/validators.js");

// Rotas públicas
router.get("/services", publicController.getActiveServices);
router.get("/barbers", publicController.getActiveBarbers);
router.get("/appointments/:barberId/:date", publicController.getAvailableSlots);

// Rotas de agendamento (cliente)
router.post(
	"/appointments",
	nonAuthAuthenticateToken,
	appointmentRules(),
	handleValidationErrors,
	appointmentController.createAppointment
);
router.get(
	"/my-appointments",
	authenticateToken,
	appointmentController.getMyAppointments
);
router.post(
	"/appointments/:id/cancel",
	authenticateToken,
	appointmentController.cancelMyAppointment
);

module.exports = router;
