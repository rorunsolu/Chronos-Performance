import App from "@/App";
import { AuthContextProvider } from "@/auth/AuthContext";
import { PerformanceReportProvider } from "@/contexts/PerformanceReportContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
	Badge,
	Button,
	ColorSchemeScript,
	createTheme,
	Fieldset,
	MantineProvider,
	Paper,
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
				variant: "default",
				bdrs: "md",
			},
		}),
		Fieldset: Fieldset.extend({
			defaultProps: {
				variant: "unstyled",
				bdrs: "md",
				c: "white",
			},
		}),
		Badge: Badge.extend({
			defaultProps: {
				//variant: "default",
				bdrs: "sm",
				size: "md",
			},
		}),
		Paper: Paper.extend({
			defaultProps: {
				withBorder: true,
				shadow: "xs",
				bdrs: "md",
				p: "md",
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
							<ColorSchemeScript defaultColorScheme="dark" />
							<MantineProvider theme={theme}>
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
