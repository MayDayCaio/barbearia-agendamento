import React, { useState, useEffect } from "react";
import moment from "moment";
import * as api from "../../services/api";
import DatePicker, { registerLocale } from "react-datepicker";
import { pt } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Ícones para navegação

registerLocale("pt", pt); // Regista o locale para o datepicker

const DateTimePicker = ({ barber, service, onSelectDateTime, onBack }) => {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [availableSlots, setAvailableSlots] = useState([]);
	const [selectedSlot, setSelectedSlot] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Define o locale do moment globalmente no componente
		moment.locale("pt-br");

		const generateAndFilterSlots = async () => {
			if (!barber?.id || !service?.duration) {
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);
			setSelectedSlot(null);

			try {
				const dateStr = moment(selectedDate).format("YYYY-MM-DD");
				const bookedSlots = await api.getAvailableSlots(barber.id, dateStr);

				const openingTime = 9;
				const closingTime = 18;
				const interval = 30;
				const allDaySlots = [];

				const now = moment();
				let currentTime = moment(selectedDate)
					.hour(openingTime)
					.minute(0)
					.second(0);
				const endTime = moment(selectedDate)
					.hour(closingTime)
					.minute(0)
					.second(0);

				while (currentTime.isBefore(endTime)) {
					if (currentTime.isAfter(now)) {
						allDaySlots.push(currentTime.format("HH:mm"));
					}
					currentTime.add(interval, "minutes");
				}

				const serviceDuration = service.duration;

				const filteredSlots = allDaySlots.filter((slot) => {
					const slotTime = moment(`${dateStr} ${slot}`);

					const isOverlapping = bookedSlots.some((bookedSlot) => {
						const bookedTime = moment(`${dateStr} ${bookedSlot.time}`);
						const bookedEndTime = bookedTime
							.clone()
							.add(bookedSlot.duration, "minutes");
						const slotEndTime = slotTime
							.clone()
							.add(serviceDuration, "minutes");

						return (
							slotTime.isBefore(bookedEndTime) &&
							slotEndTime.isAfter(bookedTime)
						);
					});

					return !isOverlapping;
				});

				setAvailableSlots(filteredSlots);
			} catch (err) {
				setError("Não foi possível carregar os horários. Tente novamente.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		generateAndFilterSlots();
	}, [selectedDate, barber, service]);

	const handleSelectSlot = (slot) => {
		setSelectedSlot(slot);
		const [hour, minute] = slot.split(":");
		const finalDateTime = moment(selectedDate)
			.hour(hour)
			.minute(minute)
			.toDate();
		onSelectDateTime(finalDateTime);
	};

	return (
		<div className="text-center text-white">
			<h2 className="text-2xl font-bold mb-4">Escolha a Data e a Hora</h2>
			<p className="text-gray-400 mb-6">
				Selecione um horário disponível para o barbeiro{" "}
				<span className="font-semibold text-blue-400">
					{barber?.name || ""}
				</span>
				.
			</p>

			<div className="flex flex-col md:flex-row gap-8 justify-center items-start">
				<div className="flex justify-center mx-auto md:mx-0">
					<DatePicker
						selected={selectedDate}
						onChange={(date) => setSelectedDate(date)}
						minDate={new Date()}
						locale="pt" // Usa o locale português registado
						inline
						renderCustomHeader={({
							date,
							decreaseMonth,
							increaseMonth,
							prevMonthButtonDisabled,
							nextMonthButtonDisabled,
						}) => (
							<div className="calendar-header">
								<button
									onClick={decreaseMonth}
									disabled={prevMonthButtonDisabled}
									type="button"
									className="calendar-navigation"
									aria-label="Mês anterior">
									<ChevronLeft size={20} />
								</button>
								<span className="calendar-month-label">
									{moment(date).format("MMMM [de] yyyy")}
								</span>
								<button
									onClick={increaseMonth}
									disabled={nextMonthButtonDisabled}
									type="button"
									className="calendar-navigation"
									aria-label="Próximo mês">
									<ChevronRight size={20} />
								</button>
							</div>
						)}
					/>
				</div>

				<div className="flex-1 max-w-sm mx-auto md:mx-0">
					<h3 className="text-lg font-semibold mb-4 text-amber-500">
						Horários para {moment(selectedDate).format("D [de] MMMM")}
					</h3>
					{loading && <p>A carregar horários...</p>}
					{error && <p className="text-red-500">{error}</p>}
					{!loading && !error && (
						<div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
							{availableSlots.length > 0 ? (
								availableSlots.map((slot) => (
									<button
										key={slot}
										onClick={() => handleSelectSlot(slot)}
										className={`p-3 rounded-lg font-semibold transition-colors duration-200 ${
											selectedSlot === slot
												? "bg-blue-600 text-white"
												: "bg-gray-700 hover:bg-gray-600"
										}`}>
										{slot}
									</button>
								))
							) : (
								<p className="col-span-full text-gray-400 mt-4">
									Não há horários disponíveis para este dia.
								</p>
							)}
						</div>
					)}
				</div>
			</div>

			<div className="mt-8">
				<button
					onClick={onBack}
					className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
					Voltar
				</button>
			</div>
		</div>
	);
};

export default DateTimePicker;
