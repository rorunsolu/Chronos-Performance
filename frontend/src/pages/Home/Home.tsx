import GameCard from "@/components/Card/GameCard";
import SpotlightSearchBar from "@/components/Spotlight/Spotlight";
import { UserAuth } from "@/hooks/UserAuthHook";
import styles from "@/pages/Home/Home.module.css";
import { notifications } from "@mantine/notifications";
import { spotlight } from "@mantine/spotlight";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Ban, Search } from "lucide-react";
import {
	Container,
	SimpleGrid,
	Skeleton,
	Stack,
	Text,
	TextInput,
	Button,
} from "@mantine/core";

interface HomePageGame {
	game_id: number;
	id: number;
	name: string;
	cover: {
		image_id: string;
	};
	rating: number;
	url: string;
	genres: {
		name: string;
	}[];
}

//! How to use Popularity API - NEW FEATURE IDEA
// https://api-docs.igdb.com/#sorting

const Home = () => {
	const { user, addFavorite } = UserAuth();
	const fetchLimit = 20;
	const fetchHomepageGames = async ({ pageParam = 0 }) => {
		const baseUrl =
			import.meta.env.VITE_PROD_BACKEND_URL ||
			import.meta.env.VITE_LOCAL_BACKEND_URL;
		const res = await fetch(
			`${baseUrl}/api/IGDBapi/homepage?offset=${pageParam}`
		);
		return res.json();
	};
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery({
		queryKey: ["homepageGames"],
		queryFn: fetchHomepageGames,
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length < fetchLimit
				? undefined
				: allPages.length * fetchLimit;
		},
		maxPages: 6,
	});

	const handleFavFailNotif = () => {
		notifications.show({
			title: "Action Failed",
			message:
				"Could not update favorites. Please try again.",
			color: "red",
			icon: <Ban />,
		});
	};

	const handleFavourite = async (gameId: number) => {
		if (!user) {
			return;
		}

		try {
			await addFavorite(gameId, user.uid);
		} catch {
			handleFavFailNotif();
			return;
		}
	};

	return status === "success" ? (
		<Container
			size="xl"
			my="sm"
			px="sm"
		>
			<Stack>
				<SpotlightSearchBar />

				<TextInput
					radius="md"
					size="sm"
					leftSection={<Search size={18} />}
					placeholder="Search games"
					readOnly
					onClick={() => {
						spotlight.open();
					}}
					color="gray"
				/>

				{data.pages.map((results, i) => (
					<SimpleGrid
						cols={{ base: 1, xs: 2, sm: 4, md: 4, lg: 5 }}
						mb="lg"
						key={i}
					>
						{results.map((game: HomePageGame) => (
							<GameCard
								key={game.id}
								game={game}
								handleFavourite={handleFavourite}
								isOnPopularPage={false}
							/>
						))}
					</SimpleGrid>
				))}

				<Button
					loaderProps={{ type: "dots" }}
					onClick={() => fetchNextPage()}
					disabled={!hasNextPage || isFetching}
					loading={isFetchingNextPage}
					bg="black"
					c="white"
					classNames={{
						root: styles.root,
					}}
				>
					{isFetchingNextPage
						? ""
						: hasNextPage
							? "Load More"
							: "Nothing more to load"}
				</Button>
			</Stack>
		</Container>
	) : status === "error" ? (
		<Container
			size="xl"
			my="sm"
			px="sm"
		>
			<Text c="red">{error.message}</Text>
		</Container>
	) : (
		<Container
			size="xl"
			my="sm"
			px="sm"
		>
			<Stack>
				<TextInput
					radius="md"
					size="md"
					leftSection={<Search size={18} />}
					placeholder="Search games"
					readOnly
					onClick={() => {
						spotlight.open();
					}}
				/>

				<SimpleGrid
					cols={{ base: 2, xs: 3, sm: 4, lg: 4 }}
					mb="lg"
				>
					{Array.from({ length: 30 }).map((_, index) => (
						<Skeleton
							key={index}
							height={300}
							width={"100%"}
							animate
						/>
					))}
				</SimpleGrid>
			</Stack>
		</Container>
	);
};

export default Home;
