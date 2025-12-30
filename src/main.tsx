import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Admin from "./pages/Admin.tsx";
import Share from "./pages/Share.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/adminastrodev" element={<Admin />} />
			<Route path="/share" element={<Share />} />
			<Route path="/projects/:id" element={<ProjectDetail />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
);
