import React, { useState, useEffect } from "react";
import moment from "moment";
import * as api from "../../services/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DateTimePicker = ({ barber, service, onSelectDateTime, onBack }) => {
	const [currentDate, setCurrentDate] = useState(moment());
	const [availableSlots, setAvailableSlots] = useState([]);
	const [selectedSlot, setSelectedSlot] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const generateAndFilterSlots = async () => {
			if (!barber?.id || !service?.duration) {
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const dateStr = currentDate.format("YYYY-MM-DD");
				const bookedSlots = await api.getAvailableSlots(barber.id, dateStr);

				const openingTime = 9;
				const closingTime = 18;
				const interval = 30;
				const allDaySlots = [];

				let currentTime = currentDate
					.clone()
					.hour(openingTime)
					.minute(0)
					.second(0);
				const endTime = currentDate
					.clone()
					.hour(closingTime)
					.minute(0)
					.second(0);

				while (currentTime.isBefore(endTime)) {
					allDaySlots.push(currentTime.format("HH:mm"));
					currentTime.add(interval, "minutes");
				}

				const serviceDuration = service.duration;

				const filteredSlots = allDaySlots.filter((slot) => {
					const slotTime = moment(`${dateStr} ${slot}`);

					if (slotTime.isBefore(moment())) {
						return false;
					}

					// CORREÇÃO: A lógica de sobreposição agora usa a duração real de cada serviço
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
	}, [currentDate, barber, service]);

	const handleNextDay = () => {
		setCurrentDate(currentDate.clone().add(1, "days"));
		setSelectedSlot(null);
	};

	const handlePrevDay = () => {
		if (!currentDate.isSame(moment(), "day")) {
			setCurrentDate(currentDate.clone().subtract(1, "days"));
			setSelectedSlot(null);
		}
	};

	const handleSelectSlot = (slot) => {
		setSelectedSlot(slot);
		const [hour, minute] = slot.split(":");
		const finalDateTime = currentDate.clone().hour(hour).minute(minute);
		onSelectDateTime(finalDateTime.toDate());
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

			<div className="flex items-center justify-center space-x-4 mb-6 bg-gray-700 p-3 rounded-lg">
				<button
					onClick={handlePrevDay}
					disabled={currentDate.isSame(moment(), "day")}
					className="p-2 rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
					<ChevronLeft size={24} />
				</button>
				<span className="text-xl font-semibold w-48 text-center">
					{currentDate.format("ddd, D [de] MMMM")}
				</span>
				<button
					onClick={handleNextDay}
					className="p-2 rounded-full hover:bg-gray-600">
					<ChevronRight size={24} />
				</button>
			</div>

			{loading && <p>A carregar horários...</p>}
			{error && <p className="text-red-500">{error}</p>}
			{!loading && !error && (
				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
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
						<p className="col-span-full text-gray-400">
							Não há horários disponíveis para este dia.
						</p>
					)}
				</div>
			)}

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
