import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyAppointments } from "../services/api";
import StatusBadge from "../components/ui/StatusBadge"; // Corrigido
import { formatDateTime } from "../utils/formatters"; // Corrigido

const ProfilePage = () => {
	const { user, token } = useAuth();
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAppointments = async () => {
			if (user && token) {
				try {
					setLoading(true);
					const data = await getMyAppointments(token);
					setAppointments(data);
				} catch (err) {
					setError("Não foi possível carregar os seus agendamentos.");
				} finally {
					setLoading(false);
				}
			}
		};
		fetchAppointments();
	}, [user, token]);

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
				Aqui pode ver o seu histórico de agendamentos.
			</p>

			<div className="bg-gray-800 p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-semibold mb-4">Meus Agendamentos</h2>
				{loading && <p>A carregar agendamentos...</p>}
				{error && <p className="text-red-500">{error}</p>}
				{!loading && appointments.length === 0 && (
					<p className="text-gray-400">Ainda não tem agendamentos.</p>
				)}

				{appointments.length > 0 && (
					<div className="overflow-x-auto">
						<table className="min-w-full bg-gray-700 rounded-md">
							<thead>
								<tr className="bg-gray-600">
									<th className="p-3 text-left">Data & Hora</th>
									<th className="p-3 text-left">Serviço</th>
									<th className="p-3 text-left">Barbeiro</th>
									<th className="p-3 text-center">Status</th>
								</tr>
							</thead>
							<tbody>
								{appointments.map((app) => (
									<tr key={app.id} className="border-t border-gray-600">
										<td className="p-3">
											{formatDateTime(app.appointment_time)}
										</td>
										<td className="p-3">{app.service_name}</td>
										<td className="p-3">{app.barber_name}</td>
										<td className="p-3 text-center">
											<StatusBadge status={app.status} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProfilePage;
