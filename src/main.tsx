import "whatwg-fetch";
import ReactDOM from 'react-dom/client'
import {App} from './App.tsx'
import { hackVH } from "./components/Mobile/hackVH.ts";

hackVH();


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <App />
)
