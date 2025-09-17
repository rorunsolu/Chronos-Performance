import { UserAuth } from "@/auth/AuthContext";
import GameCard from "@/components/Card/GameCard";
import { notifications } from "@mantine/notifications";
import { Spotlight, spotlight } from "@mantine/spotlight";
import debounce from "lodash.debounce";
import { Ban, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	useInfiniteQuery,
	useQuery,
	keepPreviousData,
} from "@tanstack/react-query";
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
// https://api-docs.igdb.com/#popscore
// https://api-docs.igdb.com/#sorting

const Home = () => {
	const { user, addFavorite } = UserAuth();

	const handleFavourite = async (gameId: number) => {
		if (!user) {
			return;
		}

		try {
			await addFavorite(gameId, user.uid);
		} catch (error) {
			handleFavFailNotif();
			return;
		}
	};

	const handleFavFailNotif = () => {
		notifications.show({
			title: "Action Failed",
			message:
				"Could not update favorites. Please try again.",
			color: "red",
			icon: <Ban />,
		});
	};

	const fetchHomepageGames = async ({ pageParam = 0 }) => {
		const baseUrl = import.meta.env.VITE_BACKEND_PORT || "";
		const res = await fetch(
			`${baseUrl}/api/IGDBapi/homepage?offset=${pageParam}`
		);
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
		maxPages: 6,
	});

	return status === "pending" ? (
		<Container size="lg">
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
	) : status === "error" ? (
		<Container
			size="lg"
			my="lg"
		>
			<Text c="red">{error.message}</Text>
		</Container>
	) : (
		<Container
			size="lg"
			my="sm"
			px="sm"
		>
			<Stack>
				<SpotlightSearch />

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
						cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 4 }}
						mb="lg"
						key={i}
					>
						{results.map((game: HomePageGame) => (
							<GameCard
								key={game.id}
								game={game}
								handleFavourite={handleFavourite}
							/>
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
		</Container>
	);
};

export default Home;

const SpotlightSearch = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [updatedAt, setUpdatedAt] = useState(0);
	const navigate = useNavigate();

	const { data, dataUpdatedAt, isFetching } = useQuery({
		queryKey: ["spotlightResults", searchQuery],
		queryFn: async () => {
			if (!searchQuery.trim()) return [];

			// return fetch(
			// 	`/api/IGDBapi/results/search?q=${encodeURIComponent(searchQuery)}`
			// ).then((res) => res.json());

			return fetch(
				`${import.meta.env.VITE_BACKEND_PORT || ""}/api/IGDBapi/results/search?q=${encodeURIComponent(searchQuery)}`
			).then((res) => res.json());
		},
		placeholderData: keepPreviousData, // Prevents UI flickering during refetch
	});

	useEffect(() => {
		if (dataUpdatedAt > updatedAt) {
			setUpdatedAt(dataUpdatedAt);
		}
	}, [dataUpdatedAt]);

	const debouncedSetSearchQuery = debounce(
		(query: string) => {
			setSearchQuery(query);
		},
		300
	); // Adjust the delay (300ms) as needed

	const spotlightItems = (data || [])
		.filter((item: HomePageGame) =>
			item.name
				.toString()
				.toLowerCase()
				.includes(searchQuery.toLowerCase().trim())
		)
		.map((item: HomePageGame) => (
			<Spotlight.Action
				key={item.id}
				onClick={() => navigate(`/game/${item.id}`)}
			>
				<img
					src={
						item.cover
							? `https://images.igdb.com/igdb/image/upload/t_cover_big/${item.cover.image_id}.jpg`
							: "https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png"
					}
					alt={`Image of ${item.name}`}
					width={50}
					height={100}
				/>
				<Stack
					ml="sm"
					gap="5"
				>
					<Text>{item.name}</Text>
					<Text
						size="xs"
						c="dimmed"
					>
						{Array.isArray(item.genres)
							? item.genres
									.map((genre) => genre.name)
									.join(", ")
							: "No genres available"}
					</Text>
				</Stack>
			</Spotlight.Action>
		));

	return (
		<Spotlight.Root
			// onQueryChange={setSearchQuery}
			onQueryChange={(query) =>
				debouncedSetSearchQuery(query)
			}
			query={searchQuery}
			closeOnActionTrigger={false}
			scrollable={spotlightItems.length > 0}
			maxHeight={400}
		>
			<Spotlight.Search
				placeholder="Search games..."
				leftSection={<Search size={20} />}
			/>
			<Spotlight.ActionsList>
				{isFetching ? (
					<Spotlight.Empty>
						<Stack>
							{Array.from({ length: 5 }).map((_, index) => (
								<Skeleton
									key={index}
									height={56}
									animate
								/>
							))}
						</Stack>
					</Spotlight.Empty>
				) : spotlightItems.length > 0 ? (
					spotlightItems
				) : (
					<Spotlight.Empty>
						Nothing found...
					</Spotlight.Empty>
				)}
			</Spotlight.ActionsList>
		</Spotlight.Root>
	);
};
