import './assets/styles/global.css'
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import AppRoutes from './routes';

function App() {
  return (
    <div>
        <AppRoutes />
        <Footer />
    </div>
  );
}

export default App;
