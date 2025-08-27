import "@/App.css";
import Header from "@/components/Header/Header";
import { AppShell, createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useDisclosure } from "@mantine/hooks";
import "@mantine/spotlight/styles.css";

function App() {
	const theme = createTheme({
		fontFamily: "Inter, sans-serif",
		cursorType: "pointer",
	});

	const [opened] = useDisclosure();

	return (
		<MantineProvider
			theme={theme}
			defaultColorScheme="dark"
		>
			<AppShell
				header={{ height: 60 }}
				navbar={{
					width: 300,
					breakpoint: "sm",
					collapsed: { mobile: !opened },
				}}
				padding="md"
			>
				<Header />

				<AppShell.Navbar p="md"></AppShell.Navbar>

				<AppShell.Main></AppShell.Main>
			</AppShell>
		</MantineProvider>
	);
}

export default App;
