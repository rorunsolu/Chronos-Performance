import { getRandomGpuAverageFps } from "@/utils/getRandomGpuAverageFps";
import { type PerformanceReport } from "@/common/types";
import { getRandomGpuName } from "@/utils/getRandomGpuName";

describe("Get the average FPS of a random GPU aslong as it has been used in a report", () => {
	it("Returns a 0 when there are no reports", () => {
		expect(getRandomGpuAverageFps([], "RTX 3080")).toEqual(
			0
		);
	});
	it("Returns an average FPS of a random GPU from the reports", () => {
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
				hardware: { gpu: "RTX 3060" },
				metrics: { averageFps: 10 },
			},
			{
				hardware: { gpu: "RTX 3070" },
				metrics: { averageFps: 300 },
			},
		];
		const randomGPU = getRandomGpuName(
			reports as unknown as PerformanceReport[]
		);
		const result = getRandomGpuAverageFps(
			reports as unknown as PerformanceReport[],
			randomGPU as string
		);
		expect([100, 10, 300]).toContain(result);
	});
});
