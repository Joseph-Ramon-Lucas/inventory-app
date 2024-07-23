import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		// how the front end will be able to contact the back end routes
		proxy: {
			//  Routes are appended with /api
			"/api": "http://localhost:3000", // this should match the URL your server is running on.
		},
	},
});
