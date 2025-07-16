export const mockServices = {
	svc1: { id: "svc1", name: "Corte de Cabelo", price: 45.0, duration: 30 },
	svc2: { id: "svc2", name: "Barba Tradicional", price: 35.0, duration: 30 },
	svc3: { id: "svc3", name: "Corte e Barba", price: 75.0, duration: 60 },
	svc4: { id: "svc4", name: "Pezinho", price: 20.0, duration: 15 },
	svc5: { id: "svc5", name: "Hidratação", price: 50.0, duration: 45 },
	svc6: { id: "svc6", name: "Sobrancelha", price: 25.0, duration: 15 },
};

export const mockBarbers = {
	brb1: {
		id: "brb1",
		name: "Ricardo",
		imageUrl: "https://placehold.co/400x400/374151/f59e0b?text=R",
	},
	brb2: {
		id: "brb2",
		name: "Fernando",
		imageUrl: "https://placehold.co/400x400/374151/f59e0b?text=F",
	},
	brb3: {
		id: "brb3",
		name: "Lucas",
		imageUrl: "https://placehold.co/400x400/374151/f59e0b?text=L",
	},
};
export const mockAppointments = [
	{
		barberId: "brb1",
		serviceDuration: 30,
		startTime: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
			10,
			0,
			0,
			0
		),
	},
	{
		barberId: "brb2",
		serviceDuration: 60,
		startTime: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
			14,
			30,
			0,
			0
		),
	},
	{
		barberId: "brb1",
		serviceDuration: 30,
		startTime: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(
			11,
			0,
			0,
			0
		),
	},
];