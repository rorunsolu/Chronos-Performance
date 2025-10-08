import { UserAuth } from "@/auth/AuthContext";
import GameCard from "@/components/Card/GameCard";
import { Carousel } from "@mantine/carousel";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { Ban } from "lucide-react";
import {
	Container,
	Stack,
	Text,
	Skeleton,
} from "@mantine/core";

// interface PopularGame {
// 	game_id: number;
// 	name: string;
// 	cover: {
// 		image_id: string;
// 	};
// 	value: number;
// 	popularity_type: number;
// }

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

const Popular = () => {
	const { user, addFavorite } = UserAuth();

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

	// https://api-docs.igdb.com/#filters

	const handleFavFailNotif = () => {
		notifications.show({
			title: "Action Failed",
			message:
				"Could not update favorites. Please try again.",
			color: "red",
			icon: <Ban />,
		});
	};

	const steamPosRevQuery = useQuery({
		queryKey: ["steamReviews"],
		queryFn: async () => {
			const baseUrl =
				import.meta.env.VITE_PROD_BACKEND_URL ||
				import.meta.env.VITE_LOCAL_BACKEND_URL;
			const res = await fetch(
				`${baseUrl}/api/IGDBapi/popular?popularity_type=${6}`
			);
			const steamPosRevData = await res.json();
			return steamPosRevData;
		},
	});

	const peak24HrQuery = useQuery({
		queryKey: ["peak24hr"],
		queryFn: async () => {
			const baseUrl =
				import.meta.env.VITE_PROD_BACKEND_URL ||
				import.meta.env.VITE_LOCAL_BACKEND_URL;
			const res = await fetch(
				`${baseUrl}/api/IGDBapi/popular?popularity_type=${5}`
			);

			const peak24HrData = await res.json();
			return peak24HrData;
		},
	});

	const mostPlayedQuery = useQuery({
		queryKey: ["mostPlayed"],
		queryFn: async () => {
			const baseUrl =
				import.meta.env.VITE_PROD_BACKEND_URL ||
				import.meta.env.VITE_LOCAL_BACKEND_URL;
			const res = await fetch(
				`${baseUrl}/api/IGDBapi/popular?popularity_type=${4}`
			);

			const mostPlayedData = await res.json();
			return mostPlayedData;
		},
	});

	if (
		steamPosRevQuery.isLoading ||
		peak24HrQuery.isLoading ||
		mostPlayedQuery.isLoading
	) {
		return (
			<Container
				size="lg"
				my="md"
			>
				<Stack>
					<Stack>
						<Skeleton
							height={20}
							mt={6}
							width="70%"
							radius="sm"
						/>
						<Carousel
							type="container"
							slideSize={{
								base: "100%",
								"300px": "40%",
								"500px": "13.333333%",
								"700px": "8.333333%",
							}}
							draggable
							slideGap="md"
							withControls={false}
						>
							{Array.from({ length: 30 }).map(
								(_, index) => (
									<Carousel.Slide
										key={index}
										style={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											height: "100%",
										}}
									>
										<Skeleton
											height={390.3}
											width={240}
											animate
										/>
									</Carousel.Slide>
								)
							)}
						</Carousel>
					</Stack>
					<Stack>
						<Skeleton
							height={20}
							mt={6}
							width="70%"
							radius="sm"
						/>
						<Carousel
							type="container"
							slideSize={{
								base: "100%",
								"300px": "40%",
								"500px": "13.333333%",
								"700px": "8.333333%",
							}}
							draggable
							slideGap="md"
							withControls={false}
						>
							{Array.from({ length: 30 }).map(
								(_, index) => (
									<Carousel.Slide
										key={index}
										style={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											height: "100%",
										}}
									>
										<Skeleton
											height={390.3}
											width={240}
											animate
										/>
									</Carousel.Slide>
								)
							)}
						</Carousel>
					</Stack>
					<Stack>
						<Skeleton
							height={20}
							mt={6}
							width="70%"
							radius="sm"
						/>
						<Carousel
							type="container"
							slideSize={{
								base: "100%",
								"300px": "40%",
								"500px": "13.333333%",
								"700px": "8.333333%",
							}}
							draggable
							slideGap="md"
							withControls={false}
						>
							{Array.from({ length: 30 }).map(
								(_, index) => (
									<Carousel.Slide
										key={index}
										style={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											height: "100%",
										}}
									>
										<Skeleton
											height={390.3}
											width={240}
											animate
										/>
									</Carousel.Slide>
								)
							)}
						</Carousel>
					</Stack>
				</Stack>
			</Container>
		);
	}

	if (mostPlayedQuery.error) {
		return <Text>Error loading most played games.</Text>;
	}

	return (
		<Container
			size="lg"
			my="md"
		>
			<Stack>
				<Stack>
					<Text fw={600}>Most Positive Reviews</Text>

					<Carousel
						type="container"
						slideSize={{
							base: "100%",
							"300px": "40%",
							"500px": "13.333333%",
							"700px": "8.333333%",
						}}
						draggable
						slideGap="md"
					>
						{steamPosRevQuery.data?.map(
							(game: HomePageGame) => (
								<Carousel.Slide
									key={game.id}
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										height: "100%",
									}}
								>
									<GameCard
										game={game}
										handleFavourite={handleFavourite}
										isOnPopularPage={true}
									/>
								</Carousel.Slide>
							)
						)}
					</Carousel>
				</Stack>

				<Stack>
					<Text fw={600}>Top 24hr Peak Players</Text>

					<Carousel
						type="container"
						slideSize={{
							base: "100%",
							"300px": "40%",
							"500px": "13.333333%",
							"700px": "8.333333%",
						}}
						draggable
						slideGap="md"
					>
						{peak24HrQuery.data?.map(
							(game: HomePageGame) => (
								<Carousel.Slide
									key={game.id}
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										height: "100%",
									}}
								>
									<GameCard
										game={game}
										handleFavourite={handleFavourite}
										isOnPopularPage={true}
									/>
								</Carousel.Slide>
							)
						)}
					</Carousel>
				</Stack>

				<Stack>
					<Text fw={600}>Most Played</Text>

					<Carousel
						type="container"
						slideSize={{
							base: "100%",
							"300px": "40%",
							"500px": "13.333333%",
							"700px": "8.333333%",
						}}
						draggable
						slideGap="md"
					>
						{mostPlayedQuery.data?.map(
							(game: HomePageGame) => (
								<Carousel.Slide
									key={game.id}
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										height: "100%",
									}}
								>
									<GameCard
										game={game}
										handleFavourite={handleFavourite}
										isOnPopularPage={true}
									/>
								</Carousel.Slide>
							)
						)}
					</Carousel>
				</Stack>
			</Stack>
		</Container>
	);
};

export default Popular;
