import { getAvgPerfRatingForOtherGames } from "@/utils/getAvgPerfRatingForOtherGames";
import { type PerformanceReport } from "@/common/types";

describe("getAvgPerfRatingForOtherGames", () => {
	it("returns a 0 when there are no reports", () => {
		expect(
			getAvgPerfRatingForOtherGames([], "game1")
		).toEqual(0);
	});
	it("returns a 0 when all reports are for the excluded game", () => {
		const reports: Pick<
			PerformanceReport,
			"IgdbGameId" | "perfRating"
		>[] = [
			{ IgdbGameId: "game1", perfRating: 80 },
			{ IgdbGameId: "game1", perfRating: 90 },
		];
		const result = getAvgPerfRatingForOtherGames(
			reports as PerformanceReport[],
			"game1"
		);
		expect(result).toEqual(0);
	});
	it("calculates the average perfRating excluding the specified game", () => {
		const reports: Pick<
			PerformanceReport,
			"IgdbGameId" | "perfRating"
		>[] = [
			{ IgdbGameId: "game1", perfRating: 80 },
			{ IgdbGameId: "game2", perfRating: 90 },
			{ IgdbGameId: "game3", perfRating: 70 },
		];
		const result = getAvgPerfRatingForOtherGames(
			reports as PerformanceReport[],
			"game1"
		);
		expect(result).toEqual(80);
	});
});
