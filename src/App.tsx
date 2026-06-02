import { Provider } from 'react-redux';
import { store } from './core/store/Store';
import './core/i18n/i18n'; // Inicializa a engine i18next
import TunerCard from './modules/Tuner/components/Tuner.Card';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-tunerDark-bg text-tunerDark-text flex flex-col justify-between py-10 px-4">
        {/* Painel Central do Afinador */}
        <div className="flex-grow flex items-center justify-center">
          <TunerCard />
        </div>

        {/* Rodapé Minimalista */}
        <footer className="text-center text-[9px] uppercase font-black tracking-widest text-slate-600 mt-8 select-none">
          © {new Date().getFullYear()} GuitarTune • Offline HTML5 Instrument Tuner
        </footer>
      </div>
    </Provider>
  );
}

export default App;
