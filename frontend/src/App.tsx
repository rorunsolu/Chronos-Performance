import "@/App.css";
import Protected from "@/auth/Protected";
import Header from "@/components/Header/Header";
import Game from "@/pages/Game/Game";
import Home from "@/pages/Home/Home";
import Portal from "@/pages/Portal/Portal";
import Profile from "@/pages/Profile/Profile";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import { Route, Routes } from "react-router-dom";
import { AppShell } from "@mantine/core";

function App() {
	return (
		<>
			<Notifications />
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
						<Route
							path="/portal"
							element={<Portal />}
						/>
						<Route
							path="/profile"
							element={
								<Protected>
									<Profile />
								</Protected>
							}
						/>
						<Route
							path="/game/:id"
							element={<Game />}
						/>
					</Routes>
				</AppShell.Main>
			</AppShell>
		</>
	);
}

export default App;
