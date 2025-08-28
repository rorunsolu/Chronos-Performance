import { Container, SimpleGrid, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

interface HomePageGame {
	id: number;
	name: string;
	cover: string;
	rating: number;
	url: string;
}

const Home = () => {
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
		<Container>
			<SimpleGrid cols={4}>
				{data.map((game: HomePageGame) => (
					<li key={game.id}>{game.name}</li>
				))}
			</SimpleGrid>
		</Container>
	);
};

export default Home;
