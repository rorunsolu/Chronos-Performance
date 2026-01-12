import { getAvgGamePerfRating } from "@/utils/getAvgGamePerfRating";
import { type PerformanceReport } from "@/common/types";

interface report {
	IgdbGameId: string;
	perfRating: number;
}

describe("Gets the overage performance rating of a game based on the reports made for said game", () => {
	it("Returns a 0 if there are no reports for the game", () => {
		expect(getAvgGamePerfRating([], "gameID51")).toBe(0);
	});
	it("Returns the average performance rating of the specified game", () => {
		const reports: report[] = [
			{ IgdbGameId: "gameID1", perfRating: 80 },
			{ IgdbGameId: "gameID1", perfRating: 90 },
			{ IgdbGameId: "gameID1", perfRating: 70 },
		];
		const result = getAvgGamePerfRating(
			reports as PerformanceReport[],
			"gameID1"
		);
		expect(result).toBe(80);
	});
});
