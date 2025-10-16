import ChronosLogo from "@/components/Branding/ChronosLogo";
import classes from "@/components/Header/Header.module.css";
import { UserAuth } from "@/hooks/UserAuthHook";
import cx from "clsx";
import { useEffect, useState } from "react";
import {
	NavLink as RouterNavLink,
	useNavigate,
} from "react-router-dom";
import {
	ActionIcon,
	Avatar,
	Button,
	Group,
	Menu,
	Text,
	useComputedColorScheme,
	useMantineColorScheme,
} from "@mantine/core";
import {
	ChevronsUpDown,
	LogOut,
	Moon,
	Sun,
	User,
} from "lucide-react";

const Header = () => {
	useEffect(() => {
		const fetchData = async () => {
			await fetchUsers();
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme(
		"light",
		{ getInitialValueInEffect: true }
	);

	const links = [
		{ link: "/", label: "Home" },
		{ link: "/popular", label: "Popular" },
	];
	const [active, setActive] = useState(links[0].link);

	const [userMenuOpened, setUserMenuOpened] =
		useState(false);

	const navigate = useNavigate();
	const { user, logOut, allUsers, fetchUsers } = UserAuth();

	const handleSignOut = async () => {
		try {
			logOut();
		} catch {
			throw new Error(
				"Failed to log out. Please try again."
			);
		}
	};

	const profileAccUrlId = allUsers.find(
		(account) => account.userId === user?.uid
	)?.accUrlId;

	const items = links.map((link) => (
		<RouterNavLink
			key={link.label}
			to={link.link}
			data-active={active === link.link || undefined}
			onClick={() => {
				setActive(link.link);
			}}
			className={cx(classes.link, {
				[classes.linkActive]: active === link.link,
			})}
			color={active === link.link ? "teal" : "black"}
		>
			<Text
				fw={500}
				size="sm"
				c={active === link.link ? "teal" : "black"}
				className={cx(classes.link, {
					[classes.linkActive]: active === link.link,
				})}
			>
				{link.label}
			</Text>
		</RouterNavLink>
	));

	return (
		<header className={classes.header}>
			<div className={classes.inner}>
				<Group className="min-w-fit">
					<ChronosLogo />
				</Group>

				<Group
					justify="space-between"
					w={"100%"}
					ml="md"
				>
					<div className="flex items-center ml-2">
						{items}
					</div>
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
								width={220}
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
												visibleFrom="xs"
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
									variant="default"
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
