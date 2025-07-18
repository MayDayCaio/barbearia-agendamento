import React from "react";

const Hero = () => {
	// A imagem de fundo é aplicada via style para facilitar a troca.
	// O ideal é que esta URL venha de um arquivo de configuração ou CMS.
	const backgroundImageUrl =
		"https://images.unsplash.com/photo-1599338440394-83957a1b0217?q=80&w=2070&auto=format&fit=crop";

	return (
		<section className="text-center mb-12 md:mb-20">
			<div
				className="p-8 rounded-2xl bg-gray-800/50 bg-cover bg-center"
				style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
				<div className="bg-gray-900/70 p-8 rounded-xl backdrop-blur-sm">
					<h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
						Seu Estilo, Nossas Mãos
					</h2>
					<p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
						Agende seu horário com os melhores profissionais da cidade e garanta
						um visual impecável.
					</p>
					<a
						href="#agendamento"
						className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 inline-block">
						Agendar Agora
					</a>
				</div>
			</div>
		</section>
	);
};

export default Hero;
