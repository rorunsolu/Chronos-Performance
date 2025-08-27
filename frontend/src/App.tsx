import "@/App.css";
import SearchBar from "@/components/SearchBar";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

function App() {
	const theme = createTheme({
		fontFamily: "Inter, sans-serif",
		cursorType: "pointer",
	});

	return (
		<MantineProvider
			theme={theme}
			defaultColorScheme="dark"
		>
			<>
				<SearchBar />
			</>
		</MantineProvider>
	);
}

export default App;
