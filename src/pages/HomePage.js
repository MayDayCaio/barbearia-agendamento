import React, { useState, useEffect } from "react";
import * as api from "../services/api";
import ServiceSelector from "../components/booking/ServiceSelector";
import BarberSelector from "../components/booking/BarberSelector";
import DateTimePicker from "../components/booking/DateTimePicker";
import Confirmation from "../components/booking/Confirmation";
import StepsIndicator from "../components/booking/StepsIndicator";
import Hero from "../components/ui/Hero";
import ConfirmationModal from "../components/ui/ConfirmationModal";

const HomePage = () => {
	const [step, setStep] = useState(1);
	const [services, setServices] = useState([]);
	const [barbers, setBarbers] = useState([]);
	const [selectedService, setSelectedService] = useState(null);
	const [selectedBarber, setSelectedBarber] = useState(null);
	const [selectedDateTime, setSelectedDateTime] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadInitialData = async () => {
			setLoading(true);
			setError(null);
			try {
				const servicesData = await api.getServices();
				const barbersData = await api.getBarbers();
				setServices(servicesData);
				setBarbers(barbersData);
			} catch (error) {
				console.error("Falha ao carregar dados iniciais:", error);
				setError(
					"Não foi possível carregar os dados. Verifique a sua conexão."
				);
			} finally {
				setLoading(false);
			}
		};
		loadInitialData();
	}, []);

	const handleSelectService = (service) => {
		setSelectedService(service);
		setStep(2);
	};

	const handleSelectBarber = (barber) => {
		setSelectedBarber(barber);
		setStep(3);
	};

	const handleSelectDateTime = (dateTime) => {
		setSelectedDateTime(dateTime);
		setStep(4);
	};

	const handleConfirmBooking = async (appointmentData, token) => {
		try {
			const result = await api.createAppointment(appointmentData, token);
			console.log("HOMEPAGE: Sucesso! Agendamento criado:", result);
			setIsModalOpen(true);
		} catch (error) {
			console.error(
				"HOMEPAGE: Ocorreu um erro no fluxo de agendamento.",
				error
			);
			alert(
				`Ocorreu um erro ao tentar agendar. Verifique a consola do navegador (F12) para a causa específica.`
			);
		}
	};

	const resetBooking = () => {
		setStep(1);
		setSelectedService(null);
		setSelectedBarber(null);
		setSelectedDateTime(null);
		setIsModalOpen(false);
	};

	const goBack = () => {
		if (step > 1) {
			setStep(step - 1);
		}
	};

	const renderStep = () => {
		if (loading)
			return (
				<p className="text-center text-white">
					A carregar dados da barbearia...
				</p>
			);
		if (error) return <p className="text-center text-red-500">{error}</p>;

		switch (step) {
			case 1:
				return (
					<ServiceSelector
						services={services}
						onSelectService={handleSelectService}
					/>
				);
			case 2:
				return (
					<BarberSelector
						barbers={barbers}
						onSelectBarber={handleSelectBarber}
						onBack={goBack}
					/>
				);
			case 3:
				return (
					<DateTimePicker
						barber={selectedBarber}
						service={selectedService}
						onSelectDateTime={handleSelectDateTime}
						onBack={goBack}
					/>
				);
			case 4:
				return (
					<Confirmation
						service={selectedService}
						barber={selectedBarber}
						dateTime={selectedDateTime}
						onConfirm={handleConfirmBooking}
						onBack={goBack}
					/>
				);
			default:
				return <p>Passo desconhecido</p>;
		}
	};

	return (
		<div>
			<Hero />
			<div className="container mx-auto p-8 bg-gray-800 rounded-lg shadow-xl -mt-16 relative z-10">
				<StepsIndicator currentStep={step} />
				<div className="mt-8">{renderStep()}</div>
			</div>
			<ConfirmationModal isOpen={isModalOpen} onClose={resetBooking} />
		</div>
	);
};

export default HomePage;
