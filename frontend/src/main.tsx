import App from "@/App";
import { AuthContextProvider } from "@/auth/AuthContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

const rootElement = document.getElementById(
	"root"
) as HTMLElement;

if (!rootElement.innerHTML) {
	const root = createRoot(rootElement);
	root.render(
		<StrictMode>
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<AuthContextProvider>
						<App />
					</AuthContextProvider>
					<ReactQueryDevtools initialIsOpen={true} />
				</QueryClientProvider>
			</BrowserRouter>
		</StrictMode>
	);
}
