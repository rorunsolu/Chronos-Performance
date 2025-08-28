import App from "@/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root") as HTMLElement;

if (!rootElement.innerHTML) {
	const root = createRoot(rootElement);
	root.render(
		<StrictMode>
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<App />
					<ReactQueryDevtools initialIsOpen={true} />
				</QueryClientProvider>
			</BrowserRouter>
		</StrictMode>
	);
}
