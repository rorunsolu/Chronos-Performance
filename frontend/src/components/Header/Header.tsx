import { UserAuth } from "@/auth/AuthContext";
import ChronosLogo from "@/components/Branding/ChronosLogo";
import classes from "@/components/Header/Header.module.css";
import { useDisclosure } from "@mantine/hooks";
import cx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ChevronsUpDown,
	LogOut,
	Moon,
	Sun,
	User,
} from "lucide-react";
import {
	Avatar,
	Burger,
	Button,
	Group,
	Menu,
	Text,
	NavLink,
	useMantineColorScheme,
	useComputedColorScheme,
	ActionIcon,
} from "@mantine/core";

const Header = () => {
	useEffect(() => {
		const fetchData = async () => {
			await fetchUsers();
		};
		fetchData();
	}, []);

	const { setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme(
		"light",
		{ getInitialValueInEffect: true }
	);

	const links = [{ link: "/", label: "Home" }];
	const [active, setActive] = useState(links[0].link);

	const [opened, { toggle }] = useDisclosure(false);
	const [userMenuOpened, setUserMenuOpened] =
		useState(false);

	const navigate = useNavigate();
	const { user, logOut, allUsers, fetchUsers } = UserAuth();

	const handleSignOut = async () => {
		try {
			logOut();
		} catch (error) {
			throw new Error(
				"Failed to log out. Please try again."
			);
		}
	};

	const profileAccUrlId = allUsers.find(
		(account) => account.userId === user?.uid
	)?.accUrlId;

	const items = links.map((link) => (
		<NavLink
			key={link.label}
			href={link.link}
			label={link.label}
			color="black"
			variant="subtle"
			fw={500}
			bdrs="md"
			p="xs"
			py={5}
			data-active={active === link.link || undefined}
			active={active === link.link}
			onClick={() => {
				setActive(link.link);
				navigate(link.link);
			}}
		/>
	));

	return (
		<header className={classes.header}>
			<div className={classes.inner}>
				<Group className="min-w-fit">
					<Burger
						opened={opened}
						onClick={toggle}
						size="sm"
						hiddenFrom="sm"
					/>
					<ChronosLogo />
				</Group>

				<Group
					justify="space-between"
					w={"100%"}
				>
					<Group
						ml={50}
						gap={5}
						className={classes.links}
						visibleFrom="sm"
					>
						{items}
					</Group>
					<Group>
						<ActionIcon
							onClick={() =>
								setColorScheme(
									computedColorScheme === "light"
										? "dark"
										: "light"
								)
							}
							variant="default"
							size="lg"
							aria-label="Toggle color scheme"
							className={classes.colorSchemeToggle}
						>
							<Sun
								className={cx(classes.icon, classes.light)}
								strokeWidth={1.75}
							/>
							<Moon
								className={cx(classes.icon, classes.dark)}
								strokeWidth={1.75}
							/>
						</ActionIcon>
						{user !== null ? (
							<Menu
								width={260}
								position="bottom-end"
								transitionProps={{
									transition: "pop-top-right",
								}}
								onClose={() => setUserMenuOpened(false)}
								onOpen={() => setUserMenuOpened(true)}
								withinPortal
								offset={2}
								withArrow
								shadow="xs"
								styles={{
									dropdown: {
										border:
											"1px solid var(--mantine-color-gray-3)",
										borderRadius: "8px",
									},
								}}
							>
								<Menu.Target>
									<Button
										px="xs"
										className={cx(classes.user, {
											[classes.userActive]: userMenuOpened,
										})}
									>
										<Group gap={7}>
											<Avatar
												src={user?.photoURL}
												alt={user?.displayName ?? undefined}
												radius="xl"
												size={20}
											/>
											<Text
												fw={500}
												size="sm"
												lh={1}
												mr={3}
											>
												{user?.displayName}
											</Text>
											<ChevronsUpDown size={12} />
										</Group>
									</Button>
								</Menu.Target>
								<Menu.Dropdown>
									<Menu.Item
										leftSection={<User size={16} />}
										onClick={async () => {
											await navigate(
												`/profile/${profileAccUrlId}`
											);
										}}
									>
										My Profile
									</Menu.Item>

									<Menu.Item
										leftSection={<LogOut size={16} />}
										onClick={async () => {
											await handleSignOut();
											navigate("/portal");
										}}
									>
										Logout
									</Menu.Item>
								</Menu.Dropdown>
							</Menu>
						) : user === null ? (
							<Group gap={10}>
								<Button
									variant="filled"
									color="teal"
									className={classes.button}
									onClick={() => navigate("/portal")}
								>
									Sign Up
								</Button>
								<Button
									variant="outline"
									color="teal"
									onClick={() => navigate("/portal")}
								>
									Login
								</Button>
							</Group>
						) : null}
					</Group>
				</Group>
			</div>
		</header>
	);
};

export default Header;
