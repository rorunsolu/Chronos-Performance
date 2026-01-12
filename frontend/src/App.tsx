import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import Game from "@/pages/Game/Game";
import Home from "@/pages/Home/Home";
import Popular from "@/pages/Popular/Popular";
import Portal from "@/pages/Portal/Portal";
import Profile from "@/pages/Profile/Profile";
import Report from "@/pages/Report/Report";
import "@mantine/carousel/styles.css";
import { AppShell } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import { Route, Routes } from "react-router-dom";
import "@/App.css";

function App() {
	return (
		<>
			<Notifications />
			<AppShell
				header={{ height: 56 }}
				aside={{
					width: 350,
					breakpoint: "md",
					collapsed: { desktop: false, mobile: true },
				}}
			>
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
							path="/profile/:accUrlId"
							element={<Profile />}
						/>
						<Route
							path="/game/:id"
							element={<Game />}
						/>
						<Route
							path="/popular"
							element={<Popular />}
						/>
						<Route
							path="/report/:id"
							element={<Report />}
						/>
					</Routes>
				</AppShell.Main>

				<AppShell.Aside>
					<Sidebar />
				</AppShell.Aside>
			</AppShell>
		</>
	);
}

export default App;
