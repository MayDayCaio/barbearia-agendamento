import React from "react";
import { CheckCircle, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Importar para saber se o utilizador está logado

const ConfirmationModal = ({ isOpen, onClose }) => {
	const { user } = useAuth(); // Obter o estado do utilizador

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
			<div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
				<CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
				<h2 className="text-2xl font-bold mb-2">
					Pedido de Agendamento Enviado!
				</h2>
				<p className="text-gray-300 mb-6">
					O seu pedido foi enviado para a nossa equipa. Em breve, receberá uma
					notificação de confirmação via{" "}
					<span className="font-semibold text-green-400">WhatsApp</span>.
				</p>

				{/* Secção de incentivo ao registo, só aparece se o utilizador não estiver logado */}
				{!user && (
					<div className="bg-gray-700 p-4 rounded-lg my-6 border border-blue-500">
						<Gift className="text-blue-400 mx-auto mb-3" size={32} />
						<h3 className="text-lg font-semibold text-white mb-2">
							Crie uma conta e aproveite!
						</h3>
						<p className="text-gray-400 text-sm mb-4">
							Registe-se para ver o seu histórico, gerir agendamentos e aceder a
							benefícios exclusivos.
						</p>
						<Link
							to="/auth"
							onClick={onClose} // Fecha o modal ao clicar no botão
							className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition duration-300 inline-block">
							Criar Conta Agora
						</Link>
					</div>
				)}

				<button
					onClick={onClose}
					className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded-lg transition duration-300">
					Fechar
				</button>
			</div>
		</div>
	);
};

export default ConfirmationModal;
