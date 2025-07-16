import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { mockAppointments } from "../../data/mockData";

const DateTimePicker = ({ booking, onSelectDateTime }) => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);
	const [timeSlots, setTimeSlots] = useState([]);

	const month = currentDate.getMonth();
	const year = currentDate.getFullYear();
	const firstDayOfMonth = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	// useMemo para otimizar a geração do calendário
	const calendarDays = useMemo(() => {
		const days = [];
		for (let i = 0; i < firstDayOfMonth; i++) {
			days.push({ key: `empty-${i}`, empty: true });
		}
		for (let i = 1; i <= daysInMonth; i++) {
			const dayDate = new Date(year, month, i);
			const isPast = dayDate < new Date().setHours(0, 0, 0, 0);
			days.push({ key: i, day: i, date: dayDate, isPast });
		}
		return days;
	}, [month, year, firstDayOfMonth, daysInMonth]);

	// useEffect para gerar os horários disponíveis sempre que uma data for selecionada
	useEffect(() => {
		if (!selectedDate || !booking.barber || !booking.service) return;

		const generateTimeSlots = () => {
			const slots = [];
			const serviceDuration = booking.service.duration;
			const workHours = { start: 9, end: 19 }; // Horário de funcionamento

			// Filtra os agendamentos existentes para o barbeiro e data selecionados
			const existingAppointments = mockAppointments.filter((app) => {
				const appDate = new Date(app.startTime);
				return (
					app.barberId === booking.barber.id &&
					appDate.toDateString() === selectedDate.toDateString()
				);
			});

			// Itera sobre o horário de funcionamento em intervalos de 15 minutos
			for (let hour = workHours.start; hour < workHours.end; hour++) {
				for (let minute = 0; minute < 60; minute += 15) {
					const slotTime = new Date(selectedDate);
					slotTime.setHours(hour, minute, 0, 0);
					const slotEndTime = new Date(
						slotTime.getTime() + serviceDuration * 60000
					);

					if (
						slotEndTime.getHours() > workHours.end ||
						(slotEndTime.getHours() === workHours.end &&
							slotEndTime.getMinutes() > 0)
					)
						continue;

					let isAvailable = slotTime >= new Date(); // Verifica se o horário não está no passado
					if (isAvailable) {
						// Verifica se o horário conflita com algum agendamento existente
						for (const app of existingAppointments) {
							const appStartTime = new Date(app.startTime);
							const appEndTime = new Date(
								appStartTime.getTime() + app.serviceDuration * 60000
							);
							if (slotTime < appEndTime && slotEndTime > appStartTime) {
								isAvailable = false;
								break;
							}
						}
					}

					slots.push({
						time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(
							2,
							"0"
						)}`,
						isAvailable,
					});
				}
			}
			setTimeSlots(slots);
		};

		generateTimeSlots();
	}, [selectedDate, booking.barber, booking.service]);

	const handleDateSelect = (date) => {
		setSelectedDate(date);
		setSelectedTime(null); // Reseta a hora ao trocar de data
	};

	const handleTimeSelect = (time) => {
		setSelectedTime(time);
		setTimeout(() => onSelectDateTime(selectedDate, time), 300);
	};

	return (
		<div>
			<h4 className="text-xl font-semibold text-center mb-6 text-amber-500">
				Escolha a data e o horário
			</h4>
			<div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
				{/* Calendário */}
				<div className="flex-1">
					<div className="bg-gray-700 p-4 rounded-lg">
						<div className="flex justify-between items-center mb-4">
							<button
								onClick={() => setCurrentDate(new Date(year, month - 1))}
								className="p-2 rounded-full hover:bg-gray-600">
								<ChevronLeft />
							</button>
							<h5 className="font-bold text-lg">
								{currentDate.toLocaleString("pt-BR", { month: "long" })} {year}
							</h5>
							<button
								onClick={() => setCurrentDate(new Date(year, month + 1))}
								className="p-2 rounded-full hover:bg-gray-600">
								<ChevronRight />
							</button>
						</div>
						<div className="grid grid-cols-7 gap-1 text-center">
							{["D", "S", "T", "Q", "Q", "S", "S"].map((d) => (
								<div key={d} className="font-bold text-amber-500 text-sm">
									{d}
								</div>
							))}
							{calendarDays.map((day) => (
								<div key={day.key}>
									{!day.empty && (
										<button
											onClick={() => handleDateSelect(day.date)}
											disabled={day.isPast}
											className={`w-10 h-10 rounded-full transition-colors ${
												day.isPast
													? "text-gray-600 cursor-not-allowed"
													: "hover:bg-gray-600"
											} ${
												selectedDate?.toDateString() === day.date.toDateString()
													? "bg-amber-500 text-gray-900 font-bold"
													: ""
											}`}>
											{day.day}
										</button>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
				{/* Horários */}
				<div className="flex-1">
					<h5 className="font-bold text-lg text-center mb-4">
						Horários Disponíveis
					</h5>
					<div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-2">
						{!selectedDate ? (
							<div className="col-span-full text-center text-gray-400">
								Selecione uma data para ver os horários.
							</div>
						) : timeSlots.length === 0 ? (
							<div className="col-span-full text-center text-gray-400">
								Carregando...
							</div>
						) : (
							timeSlots.map((slot) => (
								<button
									key={slot.time}
									onClick={() => handleTimeSelect(slot.time)}
									disabled={!slot.isAvailable}
									className={`p-2 rounded-lg transition-colors text-center ${
										!slot.isAvailable
											? "bg-gray-700 opacity-50 cursor-not-allowed"
											: "bg-gray-800 hover:bg-gray-600"
									} ${
										selectedTime === slot.time
											? "outline outline-2 outline-amber-500"
											: ""
									}`}>
									{slot.time}
								</button>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DateTimePicker;
