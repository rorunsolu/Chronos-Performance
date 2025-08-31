import { UserAuth } from "@/auth/AuthContext";
import ChronosLogo from "@/components/ChronosLogo";
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
	Settings,
	ArrowRightLeft,
	Trash2,
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
	const {
		//user,
		logOut,
	} = UserAuth();

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

	const user = {
		name: "Jane Spoonfighter",
		email: "janspoon@fighter.dev",
		image:
			"https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
	};

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
										src={user.image}
										alt={user.name}
										radius="xl"
										size={20}
									/>
									<Text
										fw={500}
										size="sm"
										lh={1}
										mr={3}
									>
										{user.name}
									</Text>
									<ChevronsUpDown size={12} />
								</Group>
							</UnstyledButton>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Label>Settings</Menu.Label>
							<Menu.Item
								leftSection={<Settings size={16} />}
							>
								Account settings
							</Menu.Item>
							<Menu.Item
								leftSection={<ArrowRightLeft size={16} />}
							>
								Change account
							</Menu.Item>
							<Menu.Item
								leftSection={<LogOut size={16} />}
								onClick={handleSignOut}
							>
								Logout
							</Menu.Item>

							<Menu.Divider />

							<Menu.Label>Danger zone</Menu.Label>
							<Menu.Item
								color="red"
								leftSection={<Trash2 size={16} />}
							>
								Delete account
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</Group>
			</div>
		</header>
	);
};

export default Header;
