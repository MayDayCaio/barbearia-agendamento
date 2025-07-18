import React from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

/**
 * Um componente de modal reutilizável para confirmações e alertas.
 * @param {object} props
 * @param {boolean} props.isOpen - Controla se o modal está visível.
 * @param {function} props.onClose - Função para fechar o modal.
 * @param {function} [props.onConfirm] - Função a ser executada ao confirmar. Se não for fornecida, o modal atua como um alerta.
 * @param {string} props.title - O título do modal.
 * @param {React.ReactNode} props.children - O conteúdo/mensagem do modal.
 * @param {string} [props.confirmText="Confirmar"] - O texto do botão de confirmação.
 * @param {string} [props.cancelText="Cancelar"] - O texto do botão de cancelamento.
 * @param {string} [props.type="confirmation"] - O tipo de modal ('confirmation', 'success', 'error').
 */
const ActionModal = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	children,
	confirmText = "Confirmar",
	cancelText = "Cancelar",
	type = "confirmation", // 'confirmation', 'success', 'error'
}) => {
	if (!isOpen) return null;

	const typeStyles = {
		confirmation: {
			icon: <AlertTriangle className="text-yellow-400" size={48} />,
			confirmButton: "bg-yellow-500 hover:bg-yellow-600",
		},
		success: {
			icon: <CheckCircle className="text-green-500" size={48} />,
			confirmButton: "bg-green-600 hover:bg-green-700",
		},
		error: {
			icon: <AlertTriangle className="text-red-500" size={48} />,
			confirmButton: "bg-red-600 hover:bg-red-700",
		},
	};

	const currentStyle = typeStyles[type] || typeStyles.confirmation;

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
			onClick={onClose}>
			<div
				className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-full max-w-md"
				onClick={(e) => e.stopPropagation()}>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold">{title}</h2>
					<button onClick={onClose} className="text-gray-400 hover:text-white">
						<X size={24} />
					</button>
				</div>
				<div className="flex items-start gap-4">
					<div className="flex-shrink-0">{currentStyle.icon}</div>
					<div className="text-gray-300 mt-1">{children}</div>
				</div>
				<div className="mt-6 flex justify-end gap-4">
					{onConfirm && (
						<button
							onClick={onClose}
							className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
							{cancelText}
						</button>
					)}
					<button
						onClick={onConfirm ? onConfirm : onClose}
						className={`${
							onConfirm
								? currentStyle.confirmButton
								: "bg-blue-600 hover:bg-blue-700"
						} text-white font-bold py-2 px-6 rounded-lg transition duration-300`}>
						{onConfirm ? confirmText : "OK"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ActionModal;
