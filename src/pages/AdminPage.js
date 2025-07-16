import React, { useState, useEffect } from "react";
import * as adminApi from "../services/adminApi";

// Função para formatar a data e hora
const formatDateTime = (isoString) => {
	const date = new Date(isoString);
	return `${date.toLocaleDateString("pt-PT")} às ${date.toLocaleTimeString(
		"pt-PT",
		{ hour: "2-digit", minute: "2-digit" }
	)}`;
};

// Componente para o status do agendamento
const StatusBadge = ({ status }) => {
	const statusStyles = {
		pending: "bg-yellow-500 text-white",
		confirmed: "bg-green-500 text-white",
		denied: "bg-red-500 text-white",
		completed: "bg-blue-500 text-white",
	};
	const statusText = {
		pending: "Pendente",
		confirmed: "Confirmado",
		denied: "Recusado",
		completed: "Concluído",
	};
	return (
		<span
			className={`px-2 py-1 rounded-full text-xs font-semibold ${
				statusStyles[status] || "bg-gray-500"
			}`}>
			{statusText[status] || status}
		</span>
	);
};

const AdminPage = () => {
	// Estados para guardar os dados da API
	const [services, setServices] = useState([]);
	const [barbers, setBarbers] = useState([]);
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Estados para os formulários de adição
	const [newService, setNewService] = useState({
		name: "",
		price: "",
		duration: "",
	});
	const [newBarber, setNewBarber] = useState({ name: "" });

	// Estado para o item a ser editado
	const [editingService, setEditingService] = useState(null);
	const [editingBarber, setEditingBarber] = useState(null);

	// Estado para a proteção por senha
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [password, setPassword] = useState("");
	const [authError, setAuthError] = useState("");

	// Função para carregar todos os dados da API
	const fetchData = async () => {
		try {
			setLoading(true);
			const [servicesData, barbersData, appointmentsData] = await Promise.all([
				adminApi.getAllServices(),
				adminApi.getAllBarbers(),
				adminApi.getAppointments(),
			]);
			setServices(servicesData);
			setBarbers(barbersData);
			setAppointments(appointmentsData);
			setError(null);
		} catch (err) {
			setError("Falha ao carregar dados. Verifique a conexão com o servidor.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	// useEffect para carregar os dados quando o componente for montado
	useEffect(() => {
		if (isAuthenticated) {
			fetchData();
		}
	}, [isAuthenticated]);

	// --- Handlers para Autenticação ---
	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
		setAuthError("");
	};

	const handlePasswordSubmit = (e) => {
		e.preventDefault();
		if (password === "admin") {
			setIsAuthenticated(true);
		} else {
			setAuthError("Senha incorreta.");
		}
	};

	// --- Handlers para Agendamentos ---
	const handleConfirmAppointment = async (id) => {
		try {
			await adminApi.confirmAppointment(id);
			fetchData(); // Recarrega os dados para refletir a mudança
		} catch (err) {
			setError("Falha ao confirmar o agendamento.");
		}
	};

	const handleDenyAppointment = async (id) => {
		try {
			await adminApi.denyAppointment(id);
			fetchData(); // Recarrega os dados
		} catch (err) {
			setError("Falha ao recusar o agendamento.");
		}
	};

	// --- Handlers para Serviços ---
	const handleNewServiceChange = (e) => {
		const { name, value } = e.target;
		setNewService((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleAddService = async (e) => {
		e.preventDefault();
		try {
			await adminApi.addService(newService);
			setNewService({ name: "", price: "", duration: "" });
			fetchData();
		} catch (err) {
			setError("Falha ao adicionar serviço.");
		}
	};

	const handleToggleServiceStatus = async (id, currentStatus) => {
		try {
			await adminApi.toggleServiceStatus(id, !currentStatus);
			fetchData();
		} catch (err) {
			setError("Falha ao alterar status do serviço.");
		}
	};

	const handleEditServiceChange = (e) => {
		const { name, value } = e.target;
		setEditingService((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleUpdateService = async (e) => {
		e.preventDefault();
		try {
			await adminApi.updateService(editingService.id, {
				name: editingService.name,
				price: editingService.price,
				duration: editingService.duration,
			});
			setEditingService(null);
			fetchData();
		} catch (err) {
			setError("Falha ao atualizar serviço.");
		}
	};

	// --- Handlers para Barbeiros ---
	const handleNewBarberChange = (e) => {
		setNewBarber({ name: e.target.value });
	};

	const handleAddBarber = async (e) => {
		e.preventDefault();
		try {
			await adminApi.addBarber(newBarber);
			setNewBarber({ name: "" });
			fetchData();
		} catch (err) {
			setError("Falha ao adicionar barbeiro.");
		}
	};

	const handleToggleBarberStatus = async (id, currentStatus) => {
		try {
			await adminApi.toggleBarberStatus(id, !currentStatus);
			fetchData();
		} catch (err) {
			setError("Falha ao alterar status do barbeiro.");
		}
	};

	const handleEditBarberChange = (e) => {
		setEditingBarber((prevState) => ({ ...prevState, name: e.target.value }));
	};

	const handleUpdateBarber = async (e) => {
		e.preventDefault();
		try {
			await adminApi.updateBarber(editingBarber.id, {
				name: editingBarber.name,
			});
			setEditingBarber(null);
			fetchData();
		} catch (err) {
			setError("Falha ao atualizar barbeiro.");
		}
	};

	// --- Renderização ---
	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
				<div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
					<h1 className="text-2xl font-bold mb-6 text-center text-white">
						Acesso Restrito
					</h1>
					<form onSubmit={handlePasswordSubmit}>
						<div className="mb-4">
							<label htmlFor="password" className="block text-gray-400 mb-2">
								Palavra-passe
							</label>
							<input
								type="password"
								id="password"
								value={password}
								onChange={handlePasswordChange}
								className="w-full px-3 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						{authError && (
							<p className="text-red-500 text-sm mb-4">{authError}</p>
						)}
						<button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
							Entrar
						</button>
					</form>
				</div>
			</div>
		);
	}

	const pendingAppointments = appointments.filter(
		(a) => a.status === "pending"
	);
	const otherAppointments = appointments.filter((a) => a.status !== "pending");

	return (
		<div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-900 text-white min-h-screen">
			<h1 className="text-3xl font-bold mb-8 border-b border-gray-700 pb-4">
				Painel de Administração
			</h1>

			{loading && <p>A carregar...</p>}
			{error && (
				<p className="text-red-500 bg-red-200 p-3 rounded-md mb-4">{error}</p>
			)}

			{/* Secção de Gestão de Agendamentos */}
			<div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-semibold mb-4">Gerir Agendamentos</h2>

				<h3 className="text-xl font-semibold mb-3 text-yellow-400">
					Agendamentos Pendentes
				</h3>
				{pendingAppointments.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-full bg-gray-700 rounded-md">
							<thead>
								<tr className="bg-gray-600">
									<th className="p-3 text-left">Cliente</th>
									<th className="p-3 text-left">Data & Hora</th>
									<th className="p-3 text-left">Serviço</th>
									<th className="p-3 text-left">Barbeiro</th>
									<th className="p-3 text-center">Ações</th>
								</tr>
							</thead>
							<tbody>
								{pendingAppointments.map((app) => (
									<tr key={app.id} className="border-t border-gray-600">
										<td className="p-3">
											{app.customer_name} ({app.customer_phone})
										</td>
										<td className="p-3">
											{formatDateTime(app.appointment_time)}
										</td>
										<td className="p-3">{app.service_name}</td>
										<td className="p-3">{app.barber_name}</td>
										<td className="p-3 flex justify-center gap-2">
											<button
												onClick={() => handleConfirmAppointment(app.id)}
												className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md">
												Aceitar
											</button>
											<button
												onClick={() => handleDenyAppointment(app.id)}
												className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md">
												Recusar
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<p className="text-gray-400">Não há agendamentos pendentes.</p>
				)}

				<h3 className="text-xl font-semibold mt-6 mb-3 text-gray-300">
					Histórico de Agendamentos
				</h3>
				{otherAppointments.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-full bg-gray-700 rounded-md">
							<thead>
								<tr className="bg-gray-600">
									<th className="p-3 text-left">Cliente</th>
									<th className="p-3 text-left">Data & Hora</th>
									<th className="p-3 text-left">Serviço</th>
									<th className="p-3 text-left">Barbeiro</th>
									<th className="p-3 text-center">Status</th>
								</tr>
							</thead>
							<tbody>
								{otherAppointments.map((app) => (
									<tr key={app.id} className="border-t border-gray-600">
										<td className="p-3">{app.customer_name}</td>
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
				) : (
					<p className="text-gray-400">Não há outros agendamentos.</p>
				)}
			</div>

			{/* Secção de Gestão de Serviços */}
			<div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-semibold mb-4">Gerir Serviços</h2>
				<form
					onSubmit={editingService ? handleUpdateService : handleAddService}
					className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
					<input
						type="text"
						name="name"
						placeholder="Nome do Serviço"
						value={editingService ? editingService.name : newService.name}
						onChange={
							editingService ? handleEditServiceChange : handleNewServiceChange
						}
						className="bg-gray-700 p-2 rounded-md"
						required
					/>
					<input
						type="number"
						name="price"
						placeholder="Preço (€)"
						value={editingService ? editingService.price : newService.price}
						onChange={
							editingService ? handleEditServiceChange : handleNewServiceChange
						}
						className="bg-gray-700 p-2 rounded-md"
						required
					/>
					<input
						type="number"
						name="duration"
						placeholder="Duração (min)"
						value={
							editingService ? editingService.duration : newService.duration
						}
						onChange={
							editingService ? handleEditServiceChange : handleNewServiceChange
						}
						className="bg-gray-700 p-2 rounded-md"
						required
					/>
					<div className="flex gap-2">
						<button
							type="submit"
							className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full">
							{editingService ? "Atualizar" : "Adicionar"}
						</button>
						{editingService && (
							<button
								onClick={() => setEditingService(null)}
								type="button"
								className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md w-full">
								Cancelar
							</button>
						)}
					</div>
				</form>
				<div className="overflow-x-auto">
					<table className="min-w-full bg-gray-700 rounded-md">
						<thead>
							<tr className="bg-gray-600">
								<th className="p-3 text-left">Nome</th>
								<th className="p-3 text-left">Preço</th>
								<th className="p-3 text-left">Duração</th>
								<th className="p-3 text-center">Status</th>
								<th className="p-3 text-center">Ações</th>
							</tr>
						</thead>
						<tbody>
							{services.map((service) => (
								<tr
									key={service.id}
									className={`border-t border-gray-600 ${
										!service.is_active ? "bg-gray-800 text-gray-500" : ""
									}`}>
									<td className="p-3">{service.name}</td>
									<td className="p-3">€{service.price}</td>
									<td className="p-3">{service.duration} min</td>
									<td className="p-3 text-center">
										<span
											className={`px-2 py-1 rounded-full text-xs font-semibold ${
												service.is_active
													? "bg-green-500 text-white"
													: "bg-red-500 text-white"
											}`}>
											{service.is_active ? "Ativo" : "Pausado"}
										</span>
									</td>
									<td className="p-3 flex justify-center gap-2">
										<button
											onClick={() => setEditingService(service)}
											className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md">
											Editar
										</button>
										<button
											onClick={() =>
												handleToggleServiceStatus(service.id, service.is_active)
											}
											className={`${
												service.is_active
													? "bg-red-600 hover:bg-red-700"
													: "bg-green-600 hover:bg-green-700"
											} text-white font-bold py-1 px-3 rounded-md`}>
											{service.is_active ? "Pausar" : "Ativar"}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Secção de Gestão de Barbeiros */}
			<div className="bg-gray-800 p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-semibold mb-4">Gerir Barbeiros</h2>
				<form
					onSubmit={editingBarber ? handleUpdateBarber : handleAddBarber}
					className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
					<input
						type="text"
						name="name"
						placeholder="Nome do Barbeiro"
						value={editingBarber ? editingBarber.name : newBarber.name}
						onChange={
							editingBarber ? handleEditBarberChange : handleNewBarberChange
						}
						className="bg-gray-700 p-2 rounded-md md:col-span-2"
						required
					/>
					<div className="flex gap-2">
						<button
							type="submit"
							className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full">
							{editingBarber ? "Atualizar" : "Adicionar"}
						</button>
						{editingBarber && (
							<button
								onClick={() => setEditingBarber(null)}
								type="button"
								className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md w-full">
								Cancelar
							</button>
						)}
					</div>
				</form>
				<div className="overflow-x-auto">
					<table className="min-w-full bg-gray-700 rounded-md">
						<thead>
							<tr className="bg-gray-600">
								<th className="p-3 text-left">Nome</th>
								<th className="p-3 text-center">Status</th>
								<th className="p-3 text-center">Ações</th>
							</tr>
						</thead>
						<tbody>
							{barbers.map((barber) => (
								<tr
									key={barber.id}
									className={`border-t border-gray-600 ${
										!barber.is_active ? "bg-gray-800 text-gray-500" : ""
									}`}>
									<td className="p-3">{barber.name}</td>
									<td className="p-3 text-center">
										<span
											className={`px-2 py-1 rounded-full text-xs font-semibold ${
												barber.is_active
													? "bg-green-500 text-white"
													: "bg-red-500 text-white"
											}`}>
											{barber.is_active ? "Ativo" : "Pausado"}
										</span>
									</td>
									<td className="p-3 flex justify-center gap-2">
										<button
											onClick={() => setEditingBarber(barber)}
											className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md">
											Editar
										</button>
										<button
											onClick={() =>
												handleToggleBarberStatus(barber.id, barber.is_active)
											}
											className={`${
												barber.is_active
													? "bg-red-600 hover:bg-red-700"
													: "bg-green-600 hover:bg-green-700"
											} text-white font-bold py-1 px-3 rounded-md`}>
											{barber.is_active ? "Pausar" : "Ativar"}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default AdminPage;
