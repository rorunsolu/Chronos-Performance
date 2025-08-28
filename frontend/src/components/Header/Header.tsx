import ChronosLogo from "@/components/ChronosLogo";
import classes from "@/components/Header/Header.module.css";
import { Burger, Group, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const links = [{ link: "/", label: "Home" }];

const Header = () => {
	const [opened, { toggle }] = useDisclosure(false);
	const [, setSearchResults] = useState([]);
	const navigate = useNavigate();

	const items = links.map((link) => (
		<a
			key={link.label}
			href={link.link}
			className={classes.link}
			onClick={(event) => {
				event.preventDefault();
				navigate(link.link);
			}}
		>
			{link.label}
		</a>
	));

	const handleSearch = async (query: string) => {
		try {
			const response = await fetch(
				`/api/IGDBapi/results/search?q=${encodeURIComponent(query)}`
			);
			if (!response.ok) {
				throw new Error(`Response is not okay ${response.status}`);
			}

			const data = await response.json();

			setSearchResults(data);
		} catch (error) {
			console.error("Error fetching search results via header search:", error);
		}
	};

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
						onChange={(e) => handleSearch(e.currentTarget.value)}
					/>
				</Group>
			</div>
		</header>
	);
};

export default Header;
