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
	return useQuery<GameInfo[]>({
		//* DATA REGARDING GAMES SHOULD ALWAYS BE AN ARRAY BRO FGS
		queryKey: ["gameInformation", id],
		queryFn: async () => {
			const response = await fetch(
				`/api/IGDBapi/gamepage/${id}`
			);
			if (!response.ok) {
				throw new Error(
					`Failed to fetch game: ${response.status}`
				);
			}
			return response.json();
		},
		placeholderData: [],
	});
};
