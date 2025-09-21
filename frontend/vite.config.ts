import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
		tailwindcss(),
	],
	server: {
		proxy: {
			"/api": {
				target:
					process.env.VITE_PROD_BACKEND_URL ||
					"http://localhost:3000",
				changeOrigin: true,
				secure: false,
				//rewrite: (path) => path.replace(/^\/api/, ""), //!DO NOT USE THIS IF YOUR BACKEND ROUTES START WITH /api (.E.G app.use("/api/IGDBapi/results", resultsApi);)
			},
		},
	},
	css: {
		modules: {
			localsConvention: "camelCase",
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./vitest.setup.mjs",
	},
});
