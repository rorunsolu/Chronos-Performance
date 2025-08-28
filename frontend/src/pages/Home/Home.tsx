import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import {
	Card,
	Container,
	Group,
	Image,
	SimpleGrid,
	Skeleton,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";

interface HomePageGame {
	id: number;
	name: string;
	cover: {
		image_id: string;
	};
	rating: number;
	url: string;
}

const Home = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const { isPending, error, data } = useQuery({
		queryKey: ["homepageGames"],
		queryFn: async () => {
			return fetch(`/api/IGDBapi/homepage`).then((res) => res.json());
		},
	});

	if (isPending)
		return (
			<SimpleGrid
				cols={4}
				spacing="sm"
				verticalSpacing="sm"
			>
				{Array.from({ length: 30 }).map((_, index) => (
					<Skeleton
						key={index}
						height={200}
						width={200}
						animate
						mb="xl"
					/>
				))}
			</SimpleGrid>
		);

	if (error) return "An error has occurred: " + error.message;

	return (
		<Container
			size="lg"
			my="lg"
		>
			<Stack>
				<TextInput
					radius="md"
					size="md"
					leftSection={<Search size={18} />}
					placeholder="Search games"
					value={searchQuery}
					onChange={(e) => () => {
						setSearchQuery(e.currentTarget.value);
					}}
				/>
				<SimpleGrid cols={{ base: 2, xs: 2, sm: 3, md: 4, lg: 4 }}>
					{data.map((game: HomePageGame) => (
						<Card
							shadow="md"
							padding="xs"
							radius="md"
							withBorder
							key={game.id}
						>
							<Card.Section>
								<Image
									src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`}
									alt={`Image of ${game.name}`}
									fallbackSrc="https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png"
								/>
							</Card.Section>
							<Group
								justify="space-between"
								mt="sm"
							>
								<Text fw={500}>{game.name}</Text>
							</Group>
						</Card>
					))}
				</SimpleGrid>
			</Stack>
		</Container>
	);
};

export default Home;
