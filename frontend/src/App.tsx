import "@/App.css";
import Header from "@/components/Header/Header";
import Home from "@/pages/Home/Home";
import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import { Route, Routes } from "react-router-dom";
import { AppShell, createTheme, MantineProvider } from "@mantine/core";

function App() {
	const theme = createTheme({
		fontFamily: "Inter, sans-serif",
		cursorType: "pointer",
	});

	return (
		<MantineProvider
			theme={theme}
			defaultColorScheme="light"
		>
			<AppShell header={{ height: 56 }}>
				<AppShell.Header>
					<Header />
				</AppShell.Header>

				<AppShell.Main>
					<Routes>
						<Route
							path="/"
							element={<Home />}
						/>
					</Routes>
				</AppShell.Main>
			</AppShell>
		</MantineProvider>
	);
}

export default App;
