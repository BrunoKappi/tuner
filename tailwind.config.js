/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores harmoniosas recomendadas no guia de design
        tunerDark: {
          bg: '#0F172A',       // Fundo slate escuro
          surface: '#1E293B',  // Superfície de cards
          text: '#FFFFFF',     // Texto primário
          muted: '#94A3B8',    // Texto secundário
        },
        tunerState: {
          success: '#10B981',  // Verde suave (afinado)
          warning: '#F59E0B',  // Amarelo/Laranja (baixo/alto)
          danger: '#EF4444',   // Vermelho (muito fora)
          nearSuccess: '#A3E635', // Verde limão (quase afinado/alto)
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
