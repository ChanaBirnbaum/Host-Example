import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
export default defineConfig({
plugins: [
react(),
federation({
name: 'shell',
filename: 'remoteEntry.js',
exposes: {
'./KeepAlive': './src/components/KeepAlive.tsx'
},
remotes: {
// דוגמה: mfe name ⇒ URL ל‐remoteEntry
notifications: 'http://localhost:5001/assets/remoteEntry.js'
},
shared: {
react: { singleton: true, requiredVersion: '^18.2.0' },
'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
'react-router-dom': { singleton: true, requiredVersion: '^6.22.0' },
zustand: { singleton: true },
'react-activation': { singleton: true }
}
})
],
build: {
target: 'es2020',
cssCodeSplit: true
}
});
