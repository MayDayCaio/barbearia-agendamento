import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-gray-800 text-gray-400 mt-16">
			<div className="container mx-auto px-6 py-8">
				<div className="flex flex-col items-center text-center">
					<h2 className="text-2xl font-bold text-white mb-2">Barbearia App</h2>
					<p className="max-w-md mb-6">
						O seu estilo, nas mãos dos melhores profissionais. Agende o seu
						horário e transforme o seu visual.
					</p>
					<div className="flex space-x-6 mb-6">
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-white transition-colors duration-300">
							<Facebook size={24} />
						</a>
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-white transition-colors duration-300">
							<Instagram size={24} />
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-white transition-colors duration-300">
							<Twitter size={24} />
						</a>
					</div>
				</div>
				<div className="border-t border-gray-700 mt-6 pt-6 text-center">
					<p>
						&copy; {new Date().getFullYear()} Barbearia App. Todos os direitos
						reservados.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
