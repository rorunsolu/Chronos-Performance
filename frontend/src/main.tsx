import App from "@/App";
import { AuthContextProvider } from "@/auth/AuthContext";
import { PerformanceReportProvider } from "@/contexts/PerformanceReportContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
	ColorSchemeScript,
	MantineProvider,
	Button,
	createTheme,
} from "@mantine/core";
import {
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

const rootElement = document.getElementById(
	"root"
) as HTMLElement;

const theme = createTheme({
	fontFamily: "Inter, sans-serif",
	cursorType: "pointer",
	components: {
		Button: Button.extend({
			defaultProps: {
				color: "teal",
				variant: "light",
			},
		}),
	},
});

if (!rootElement.innerHTML) {
	const root = createRoot(rootElement);
	root.render(
		<StrictMode>
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<AuthContextProvider>
						<PerformanceReportProvider>
							<ColorSchemeScript defaultColorScheme="auto" />
							<MantineProvider
								defaultColorScheme="auto"
								theme={theme}
							>
								<App />
							</MantineProvider>
						</PerformanceReportProvider>
					</AuthContextProvider>
					<ReactQueryDevtools initialIsOpen={true} />
				</QueryClientProvider>
			</BrowserRouter>
		</StrictMode>
	);
}
