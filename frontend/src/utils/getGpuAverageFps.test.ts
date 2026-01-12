import { getGpuAverageFps } from "@/utils/getGpuAverageFps";
import { type PerformanceReport } from "@/common/types";

describe("get the average fps of a specific gpu", () => {
	it("returns 0 when there are no reports", () => {
		expect(getGpuAverageFps([], "RTX 3080")).toEqual(0);
	});
	it("calculates the average fps of the GPU", () => {
		const reports: Array<{
			hardware: Pick<PerformanceReport["hardware"], "gpu">;
			metrics: Pick<
				PerformanceReport["metrics"],
				"averageFps"
			>;
		}> = [
			{
				hardware: { gpu: "RTX 3080" },
				metrics: { averageFps: 100 },
			},
			{
				hardware: { gpu: "RTX 3080" },
				metrics: { averageFps: 200 },
			},
			{
				hardware: { gpu: "RTX 3080" },
				metrics: { averageFps: 150 },
			},
			{
				hardware: { gpu: "RTX 3080" },
				metrics: { averageFps: 250 },
			},
			{
				hardware: { gpu: "RTX 3080" },
				metrics: { averageFps: 300 },
			},
			{
				hardware: { gpu: "RTX 3080" },
				metrics: { averageFps: 400 },
			},
		];
		const result = getGpuAverageFps(
			reports as PerformanceReport[],
			"RTX 3080"
		);
		expect(result).toBeCloseTo(233.33, 0);
		// https://vitest.dev/api/expect#tobecloseto
	});
});
