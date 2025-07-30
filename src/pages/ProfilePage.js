import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyAppointments, cancelMyAppointment } from "../services/api";
import StatusBadge from "../components/ui/StatusBadge";
import { formatDateTime } from "../utils/formatters";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
	const { user, token } = useAuth();
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const fetchAppointments = async () => {
		if (user && token) {
			try {
				setLoading(true);
				const data = await getMyAppointments(token);
				setAppointments(data);
				setError(null);
			} catch (err) {
				setError("Não foi possível carregar os seus agendamentos.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		if (!token) {
			navigate("/auth");
		} else {
			fetchAppointments();
		}
	}, [user, token, navigate]);

	const handleCancelAppointment = async (appointmentId) => {
		if (
			window.confirm("Tem a certeza de que deseja cancelar este agendamento?")
		) {
			try {
				await cancelMyAppointment(appointmentId, token);
				fetchAppointments();
			} catch (err) {
				alert("Ocorreu um erro ao tentar cancelar o agendamento.");
				console.error(err);
			}
		}
	};

	if (loading) {
		return <p className="text-center text-white p-8">A carregar perfil...</p>;
	}

	if (!user) {
		return (
			<p className="text-center text-white p-8">
				Por favor, faça login para ver o seu perfil.
			</p>
		);
	}

	return (
		<div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-900 text-white min-h-screen">
			<h1 className="text-3xl font-bold mb-2">Bem-vindo, {user.name}!</h1>
			<p className="text-gray-400 mb-8">
				Aqui pode ver e gerir o seu histórico de agendamentos.
			</p>

			<div className="bg-gray-800 p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-semibold mb-4">Meus Agendamentos</h2>
				{error && <p className="text-red-500 mb-4">{error}</p>}

				<div className="overflow-x-auto">
					<table className="min-w-full bg-gray-700 rounded-md">
						<thead>
							<tr className="bg-gray-600">
								<th className="p-3 text-left">Data & Hora</th>
								<th className="p-3 text-left">Serviço</th>
								<th className="p-3 text-left">Barbeiro</th>
								<th className="p-3 text-center">Status</th>
								<th className="p-3 text-center">Ações</th>
							</tr>
						</thead>
						<tbody>
							{appointments.length > 0 ? (
								appointments.map((app) => (
									<tr key={app.id} className="border-t border-gray-600">
										<td className="p-3">
											{formatDateTime(app.appointment_time)}
										</td>
										<td className="p-3">{app.service_name}</td>
										<td className="p-3">{app.barber_name}</td>
										<td className="p-3 text-center">
											<StatusBadge status={app.status} />
										</td>
										<td className="p-3 text-center">
											{(app.status === "pending" ||
												app.status === "confirmed") && (
												<button
													onClick={() => handleCancelAppointment(app.id)}
													className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-xs">
													Cancelar
												</button>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="5" className="text-center p-4 text-gray-400">
										Ainda não tem agendamentos.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
