import { Skeleton, Stack, Text } from "@mantine/core";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	keepPreviousData,
	useQuery,
} from "@tanstack/react-query";
import {
	SpotlightAction,
	SpotlightActionsList,
	SpotlightEmpty,
	SpotlightRoot,
	SpotlightSearch,
} from "@mantine/spotlight";

const SpotlightSearchBar = () => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const { data, isFetching } = useQuery({
		queryKey: ["spotlightResults", debouncedQuery],
		queryFn: async () => {
			if (!debouncedQuery.trim()) return [];

			return fetch(
				`${import.meta.env.VITE_PROD_BACKEND_URL || import.meta.env.VITE_LOCAL_BACKEND_URL}/api/IGDBapi/results/search?q=${encodeURIComponent(debouncedQuery)}`
			).then((res) => res.json());
		},
		placeholderData: keepPreviousData, // Prevents UI flickering during refetch
	});

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [searchQuery]);

	const spotlightItems = (data || [])
		.filter((item: HomePageGame) =>
			item.name
				.toString()
				.toLowerCase()
				.includes(debouncedQuery.toLowerCase().trim())
		)
		.map((item: HomePageGame) => (
			<SpotlightAction
				key={item.id}
				onClick={() => navigate(`/game/${item.id}`)}
			>
				<img
					src={
						item.cover
							? `https://images.igdb.com/igdb/image/upload/t_cover_big/${item.cover.image_id}.jpg`
							: "https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png"
					}
					alt={`${item.name}`}
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
			</SpotlightAction>
		));

	return (
		<SpotlightRoot
			onQueryChange={setSearchQuery}
			query={searchQuery}
			closeOnActionTrigger={false}
			scrollable={spotlightItems.length > 0}
			maxHeight={400}
		>
			<SpotlightSearch
				placeholder="Search games..."
				leftSection={<Search size={20} />}
			/>
			<SpotlightActionsList>
				{isFetching ? (
					<SpotlightEmpty>
						<Stack>
							{Array.from({ length: 5 }).map((_, index) => (
								<Skeleton
									key={index}
									height={56}
									animate
								/>
							))}
						</Stack>
					</SpotlightEmpty>
				) : spotlightItems.length > 0 ? (
					spotlightItems
				) : (
					<SpotlightEmpty>Nothing found...</SpotlightEmpty>
				)}
			</SpotlightActionsList>
		</SpotlightRoot>
	);
};

export default SpotlightSearchBar;

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
