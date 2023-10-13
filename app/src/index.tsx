import { BrowserRouter } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import {createRoot} from "react-dom/client";

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
    <BrowserRouter>
        <NavBar />
        <App />
        <Footer />
    </BrowserRouter>
);

reportWebVitals();