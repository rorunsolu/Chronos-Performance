import { useQuery } from "@tanstack/react-query";

export type GameInfo = {
	id: number;
	name: string;
	cover: {
		image_id: string;
	};
	summary: string;
	rating: number;
	genres: {
		name: string;
	}[];
	url: string;
	game_engines: {
		name: string;
		logo?: string;
	}[];
	websites: {
		url: string;
		type: number;
	}[];
	release_dates: {
		y: number;
	}[];
};

export const useGameDetails = (id: string | undefined) => {
	const baseUrl =
		import.meta.env.VITE_PROD_BACKEND_URL ||
		import.meta.env.VITE_LOCAL_BACKEND_URL;
	const { data, error, isFetching, status } = useQuery<
		GameInfo[]
	>({
		queryKey: ["gameInformation", id],
		queryFn: async () => {
			const response = await fetch(
				`${baseUrl}/api/IGDBapi/gamepage/${id}`
			);
			if (!response.ok) {
				throw new Error(
					`Failed to fetch game: ${response.status}`
				);
			}
			return response.json();
		},
		// placeholderData: [], // this was causing an issue with the pending/isfetching statuses preventing the skeletons from appearing during those statuses
	});

	return { data, error, isFetching, status };
};
