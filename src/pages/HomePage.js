import React, { useState, useEffect } from "react";
import Header from "../components/ui/Header";
import Hero from "../components/ui/Hero";
import StepsIndicator from "../components/booking/StepsIndicator";
import ServiceSelector from "../components/booking/ServiceSelector";
import BarberSelector from "../components/booking/BarberSelector";
import DateTimePicker from "../components/booking/DateTimePicker";
import Confirmation from "../components/booking/Confirmation";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import * as api from "../services/api"; // Importa o nosso serviço de API

const HomePage = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const [booking, setBooking] = useState({
		service: null,
		barber: null,
		date: null,
		time: null,
		customer: null,
	});
	const [showModal, setShowModal] = useState(false);

	// Estados para guardar os dados vindos da API
	const [services, setServices] = useState([]);
	const [barbers, setBarbers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// useEffect para carregar os dados iniciais (serviços e barbeiros)
	useEffect(() => {
		const loadInitialData = async () => {
			try {
				setIsLoading(true);
				const [servicesData, barbersData] = await Promise.all([
					api.fetchServices(),
					api.fetchBarbers(),
				]);
				setServices(servicesData);
				setBarbers(barbersData);
				setError(null);
			} catch (err) {
				setError(err.message);
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};
		loadInitialData();
	}, []);

	const resetBooking = () => {
		setBooking({
			service: null,
			barber: null,
			date: null,
			time: null,
			customer: null,
		});
		setCurrentStep(1);
		setShowModal(false);
	};

	const handleSelectService = (service) => {
		setBooking((prev) => ({ ...prev, service }));
		setCurrentStep(2);
	};

	const handleSelectBarber = (barber) => {
		setBooking((prev) => ({ ...prev, barber }));
		setCurrentStep(3);
	};

	const handleSelectDateTime = (date, time) => {
		setBooking((prev) => ({ ...prev, date, time }));
		setCurrentStep(4);
	};

	const handleConfirm = async (customerData) => {
		const [hour, minute] = booking.time.split(":");
		const appointmentTime = new Date(booking.date);
		appointmentTime.setHours(hour, minute, 0, 0);

		const finalBooking = {
			serviceId: booking.service.id,
			barberId: booking.barber.id,
			appointmentTime: appointmentTime.toISOString(),
			customerName: customerData.name,
			customerPhone: customerData.phone,
		};

		try {
			const created = await api.createAppointment(finalBooking);
			console.log("AGENDAMENTO GUARDADO NA BASE DE DADOS:", created);
			setBooking((prev) => ({ ...prev, customer: customerData }));
			setShowModal(true);
		} catch (err) {
			console.error(err);
			alert(`Erro ao agendar: ${err.message}`);
		}
	};

	const renderStepComponent = () => {
		if (isLoading) return <p className="text-center">A carregar...</p>;
		if (error)
			return (
				<p className="text-center text-red-400">
					Erro ao carregar dados: {error}
				</p>
			);

		switch (currentStep) {
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
					/>
				);
			case 3:
				return (
					<DateTimePicker
						booking={booking}
						onSelectDateTime={handleSelectDateTime}
					/>
				);
			case 4:
				return <Confirmation booking={booking} onConfirm={handleConfirm} />;
			default:
				return null;
		}
	};

	return (
		<div className="container mx-auto max-w-7xl p-4 md:p-8">
			<Header />
			<Hero />

			<section
				id="agendamento"
				className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl">
				<h3 className="text-3xl font-bold text-center mb-8 text-white">
					Faça o seu Agendamento
				</h3>
				<StepsIndicator currentStep={currentStep} />

				<div className="mt-8 min-h-[250px]">{renderStepComponent()}</div>

				{currentStep > 1 && !isLoading && (
					<div className="text-center mt-8">
						<button
							onClick={() => setCurrentStep((s) => s - 1)}
							className="text-amber-500 hover:text-amber-400 font-semibold">
							&larr; Voltar
						</button>
					</div>
				)}
			</section>

			<ConfirmationModal
				booking={booking}
				show={showModal}
				onClose={resetBooking}
			/>
		</div>
	);
};

export default HomePage;
