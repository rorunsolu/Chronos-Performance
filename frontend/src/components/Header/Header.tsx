import ChronosLogo from "@/components/ChronosLogo";
import classes from "@/components/Header/Header.module.css";
import { Burger, Group, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Search } from "lucide-react";

const links = [
	{ link: "/about", label: "Features" },
	{ link: "/pricing", label: "Pricing" },
	{ link: "/learn", label: "Learn" },
	{ link: "/community", label: "Community" },
];

const Header = () => {
	const [opened, { toggle }] = useDisclosure(false);

	const items = links.map((link) => (
		<a
			key={link.label}
			href={link.link}
			className={classes.link}
			onClick={(event) => event.preventDefault()}
		>
			{link.label}
		</a>
	));

	return (
		<header className={classes.header}>
			<div className={classes.inner}>
				<Group>
					<Burger
						opened={opened}
						onClick={toggle}
						size="sm"
						hiddenFrom="sm"
					/>
					<ChronosLogo />
				</Group>

				<Group>
					<Group
						ml={50}
						gap={5}
						className={classes.links}
						visibleFrom="sm"
					>
						{items}
					</Group>
					<TextInput
						placeholder="Search games"
						leftSectionPointerEvents="none"
						leftSection={<Search size={14} />}
					/>
				</Group>
			</div>
		</header>
	);
};

export default Header;
