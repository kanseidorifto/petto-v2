import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	return {
		server: {
			proxy: {
				'/api': {
					target: process.env.VITE_APP_API_URL,
					changeOrigin: true,
					secure: false,
					ws: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
		define: {
			// 'process.env.YOUR_STRING_VARIABLE': JSON.stringify(env.YOUR_STRING_VARIABLE),
			// 'process.env.YOUR_BOOLEAN_VARIABLE': env.YOUR_BOOLEAN_VARIABLE,
			// If you want to exposes all env variables, which is not recommended
			'process.env': process.env,
		},
		plugins: [react()],
	};
});
