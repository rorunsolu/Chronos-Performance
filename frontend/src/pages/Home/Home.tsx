import { Spotlight, spotlight } from "@mantine/spotlight";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
	useInfiniteQuery,
	useQuery,
	keepPreviousData,
} from "@tanstack/react-query";
import {
	Card,
	Container,
	Grid,
	Group,
	Image,
	SimpleGrid,
	Skeleton,
	Stack,
	Text,
	TextInput,
	Button,
} from "@mantine/core";
// import type { SpotlightActionData } from "@mantine/spotlight";

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
	const fetchHomepageGames = async ({ pageParam = 0 }) => {
		const res = await fetch(`/api/IGDBapi/homepage?offset=${pageParam}`);
		return res.json();
	};

	const fetchLimit = 20;

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
		maxPages: 4,
	});

	return status === "pending" ? (
		<Container
			size="lg"
			my="lg"
		>
			<Grid>
				{Array.from({ length: 30 }).map((_, index) => (
					<Skeleton
						key={index}
						height={200}
						width={200}
						animate
						mb="sm"
					/>
				))}
			</Grid>
		</Container>
	) : status === "error" ? (
		<Container
			size="lg"
			my="lg"
		>
			<Text c="red">Error: {error.message}</Text>
		</Container>
	) : (
		<Container
			size="lg"
			my="lg"
		>
			<Stack>
				<SpotlightSearch />

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

				{data.pages.map((results, i) => (
					<SimpleGrid
						cols={{ base: 2, xs: 2, sm: 3, md: 4, lg: 4 }}
						mb="lg"
						key={i}
					>
						{results.map((game: HomePageGame) => (
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
				))}

				<Button
					loaderProps={{ type: "dots" }}
					onClick={() => fetchNextPage()}
					disabled={!hasNextPage || isFetching}
					loading={isFetchingNextPage}
				>
					{isFetchingNextPage
						? ""
						: hasNextPage
							? "Load More"
							: "Nothing more to load"}
				</Button>
			</Stack>
			<div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
		</Container>
	);
};

export default Home;

const SpotlightSearch = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [updatedAt, setUpdatedAt] = useState(0);

	const { isPending, error, data, dataUpdatedAt } = useQuery({
		queryKey: ["spotlightResults", searchQuery],
		queryFn: async () => {
			if (!searchQuery.trim()) return [];

			return fetch(
				`/api/IGDBapi/results/search?q=${encodeURIComponent(searchQuery)}`
			).then((res) => res.json());
		},
		placeholderData: keepPreviousData, // Prevents UI flickering during refetch
	});

	useEffect(() => {
		if (dataUpdatedAt > updatedAt) {
			setUpdatedAt(dataUpdatedAt);
		}
	}, [dataUpdatedAt]);

	if (isPending)
		return (
			<Container
				size="lg"
				my="lg"
			>
				<Stack>
					{Array.from({ length: 5 }).map((_, index) => (
						<Skeleton
							key={index}
							height={56}
							//width={200}
							animate
							mb="sm"
						/>
					))}
				</Stack>
			</Container>
		);

	if (error) return "An error has occurred: " + error.message;

	const spotlightItems = data
		.filter((item: HomePageGame) =>
			item.name
				.toString()
				.toLowerCase()
				.includes(searchQuery.toLowerCase().trim())
		)
		.map((item: HomePageGame) => (
			<Spotlight.Action
				key={item.id}
				label={item.name}
			/>
		));

	return (
		<>
			<Spotlight.Root
				onQueryChange={setSearchQuery}
				query={searchQuery}
				closeOnActionTrigger={false}
			>
				<Spotlight.Search
					placeholder="Search..."
					leftSection={<Search size={20} />}
				/>
				<Spotlight.ActionsList>
					{spotlightItems.length > 0 ? (
						spotlightItems
					) : (
						<Spotlight.Empty>Nothing found...</Spotlight.Empty>
					)}
				</Spotlight.ActionsList>
			</Spotlight.Root>
		</>
	);
};
