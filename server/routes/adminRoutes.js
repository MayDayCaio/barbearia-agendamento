const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");
const {
	serviceRules,
	barberRules,
	handleValidationErrors,
} = require("../middleware/validators.js");
// Numa aplicação real, adicionaríamos aqui um middleware para verificar se o utilizador é admin
// Ex: const { isAdmin } = require("../middleware/auth"); router.use(isAdmin);

router.post("/login", adminController.loginAdmin);

router.get("/appointments", adminController.getAllAppointments);
router.post("/appointments/:id/confirm", adminController.confirmAppointment);
router.post("/appointments/:id/deny", adminController.denyAppointment);
router.post(
	"/appointments/:id/cancel",
	adminController.cancelAppointmentByAdmin
);

router.get("/services", adminController.getAllServices);
router.post(
	"/services",
	serviceRules(),
	handleValidationErrors,
	adminController.addService
);
router.put(
	"/services/:id",
	serviceRules(),
	handleValidationErrors,
	adminController.updateService
);
router.patch("/services/:id/status", adminController.toggleServiceStatus);
router.delete("/services/:id", adminController.deleteService);

router.get("/barbers", adminController.getAllBarbers);
router.post(
	"/barbers",
	barberRules(),
	handleValidationErrors,
	adminController.addBarber
);
router.put(
	"/barbers/:id",
	barberRules(),
	handleValidationErrors,
	adminController.updateBarber
);
router.patch("/barbers/:id/status", adminController.toggleBarberStatus);
router.delete("/barbers/:id", adminController.deleteBarber);

module.exports = router;
