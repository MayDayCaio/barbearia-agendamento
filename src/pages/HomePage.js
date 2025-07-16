import React, { useState, useEffect } from "react";
import * as api from "../services/api"; // Importa tudo de api.js
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

	useEffect(() => {
		const loadInitialData = async () => {
			try {
				// Usa as funções corretas do objeto api
				const servicesData = await api.getServices();
				const barbersData = await api.getBarbers();
				setServices(servicesData);
				setBarbers(barbersData);
			} catch (error) {
				console.error("Falha ao carregar dados iniciais:", error);
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
			// Usa a função correta do objeto api
			await api.createAppointment(appointmentData, token);
			setIsModalOpen(true); // Abre o modal de sucesso
		} catch (error) {
			console.error("Falha ao criar agendamento:", error);
			alert("Ocorreu um erro ao tentar agendar. Por favor, tente novamente.");
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
