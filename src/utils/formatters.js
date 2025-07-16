export const formatDateTime = (isoString) => {
	if (!isoString) return "Data inválida";
	const date = new Date(isoString);
	return `${date.toLocaleDateString("pt-PT")} às ${date.toLocaleTimeString(
		"pt-PT",
		{ hour: "2-digit", minute: "2-digit" }
	)}`;
};
