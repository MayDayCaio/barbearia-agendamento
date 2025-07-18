import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3003, // Mantém a porta 3003
		host: true, // Permite acesso a partir de outros dispositivos na mesma rede
	},
});
