import React from "react";
import { Scissors } from "lucide-react"; // Importando o ícone

const Header = () => {
	return (
		<header className="flex justify-between items-center mb-8 md:mb-12">
			<div className="flex items-center gap-3">
				<Scissors className="w-8 h-8 text-amber-500" />
				<h1 className="text-2xl md:text-3xl font-bold text-white">
					Barbearia Premium
				</h1>
			</div>
			<a
				href="#agendamento"
				className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors hidden sm:block">
				Agendar Horário
			</a>
		</header>
	);
};

export default Header;
