import { type PerformanceReport } from "@/common/types";
import { getGameAverageFps } from "@/utils/getGameAverageFps";

interface report {
	IgdbGameId: string;
	metrics: { averageFps: number };
}

describe("Get the average FPS of this game", () => {
	it("returns a 0 if there are no reports for the game", () => {
		expect(getGameAverageFps([], "game35")).toBe(0);
	});
	it("returns the average FPS of the game based on it's reports", () => {
		const reports: report[] = [
			{
				IgdbGameId: "486547409276926",
				metrics: { averageFps: 100 },
			},
			{
				IgdbGameId: "486547409276926",
				metrics: { averageFps: 100 },
			},
			{
				IgdbGameId: "game35",
				metrics: { averageFps: 100 },
			},
		];
		const result = getGameAverageFps(
			reports as PerformanceReport[],
			"486547409276926"
		);
		expect(result).toEqual(100);
	});
});
