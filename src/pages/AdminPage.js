import React, { useState, useEffect } from "react";
import * as adminApi from "../services/adminApi";

// Componente para gerir serviços (pode ser movido para o seu próprio ficheiro)
const ServiceManager = () => {
	const [services, setServices] = useState([]);

	useEffect(() => {
		adminApi.fetchAdminServices().then(setServices);
	}, []);

	const handleToggleActive = (service) => {
		const updatedService = { ...service, is_active: !service.is_active };
		adminApi.updateService(service.id, updatedService).then((updated) => {
			setServices(services.map((s) => (s.id === updated.id ? updated : s)));
		});
	};

	// O formulário para adicionar/editar seria adicionado aqui
	return (
		<div className="bg-gray-800 p-6 rounded-lg">
			<h3 className="text-2xl font-bold mb-4 text-white">Gerir Serviços</h3>
			<ul className="space-y-3">
				{services.map((service) => (
					<li
						key={service.id}
						className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
						<div>
							<p className="font-semibold text-white">{service.name}</p>
							<p className="text-sm text-gray-400">
								R$ {service.price} - {service.duration} min
							</p>
						</div>
						<button
							onClick={() => handleToggleActive(service)}
							className={`px-4 py-2 rounded-md font-bold text-sm ${
								service.is_active
									? "bg-green-500 hover:bg-green-600"
									: "bg-red-500 hover:bg-red-600"
							}`}>
							{service.is_active ? "Ativo" : "Pausado"}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

// Componente para gerir barbeiros (pode ser movido para o seu próprio ficheiro)
const BarberManager = () => {
	const [barbers, setBarbers] = useState([]);

	useEffect(() => {
		adminApi.fetchAdminBarbers().then(setBarbers);
	}, []);

	const handleToggleActive = (barber) => {
		const updatedBarber = { ...barber, is_active: !barber.is_active };
		adminApi.updateBarber(barber.id, updatedBarber).then((updated) => {
			setBarbers(barbers.map((b) => (b.id === updated.id ? updated : b)));
		});
	};

	return (
		<div className="bg-gray-800 p-6 rounded-lg">
			<h3 className="text-2xl font-bold mb-4 text-white">Gerir Barbeiros</h3>
			<ul className="space-y-3">
				{barbers.map((barber) => (
					<li
						key={barber.id}
						className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
						<p className="font-semibold text-white">{barber.name}</p>
						<button
							onClick={() => handleToggleActive(barber)}
							className={`px-4 py-2 rounded-md font-bold text-sm ${
								barber.is_active
									? "bg-green-500 hover:bg-green-600"
									: "bg-red-500 hover:bg-red-600"
							}`}>
							{barber.is_active ? "Ativo" : "Pausado"}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

const AdminPage = ({ onLogout }) => {
	return (
		<div className="container mx-auto max-w-5xl p-4 md:p-8">
			<div className="flex justify-between items-center mb-8">
				<h2 className="text-4xl font-bold text-white">
					Painel de Administração
				</h2>
				<button
					onClick={onLogout}
					className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">
					Sair
				</button>
			</div>
			<div className="grid md:grid-cols-2 gap-8">
				<ServiceManager />
				<BarberManager />
			</div>
		</div>
	);
};

export default AdminPage;
