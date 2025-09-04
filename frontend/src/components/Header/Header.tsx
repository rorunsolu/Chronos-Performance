import { UserAuth } from "@/auth/AuthContext";
import ChronosLogo from "@/components/Branding/ChronosLogo";
import classes from "@/components/Header/Header.module.css";
import { useDisclosure } from "@mantine/hooks";
import cx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Burger,
	Group,
	Menu,
	Text,
	Avatar,
	UnstyledButton,
} from "@mantine/core";
import {
	ArrowRightLeft,
	LogOut,
	ChevronsUpDown,
} from "lucide-react";

const Header = () => {
	const links = [{ link: "/", label: "Home" }];
	const [active, setActive] = useState(links[0].link);

	const [opened, { toggle }] = useDisclosure(false);
	const [userMenuOpened, setUserMenuOpened] =
		useState(false);

	const navigate = useNavigate();
	const { user, logOut } = UserAuth();

	const handleSignOut = async () => {
		try {
			logOut();
		} catch (error) {
			throw new Error(
				"Failed to log out. Please try again."
			);
		}
	};

	const items = links.map((link) => (
		<a
			key={link.label}
			href={link.link}
			className={classes.link}
			data-active={active === link.link || undefined}
			onClick={(event) => {
				event.preventDefault();
				setActive(link.link);
				navigate(link.link);
			}}
		>
			{link.label}
		</a>
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
					<Menu
						width={260}
						position="bottom-end"
						transitionProps={{
							transition: "pop-top-right",
						}}
						onClose={() => setUserMenuOpened(false)}
						onOpen={() => setUserMenuOpened(true)}
						withinPortal
					>
						<Menu.Target>
							<UnstyledButton
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
							</UnstyledButton>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item
								leftSection={<ArrowRightLeft size={16} />}
								onClick={async () => {
									await handleSignOut();
									navigate("/portal");
								}}
							>
								Change account
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
				</Group>
			</div>
		</header>
	);
};

export default Header;
