import {
	type GPUOptions,
	type PerformanceReport,
} from "@/common/types";
import { getRandomGpuName } from "@/utils/getRandomGpuName";

describe("get the name of a random gpu that has been used in any of the reports", () => {
	it("returns a null value when there are no reports ", () => {
		expect(getRandomGpuName([])).toBeNull();
	});
	it("gets a random gpu name from the exisiting reports", () => {
		const reports: Array<{
			hardware: { gpu: GPUOptions };
			// easier to just not use the full performance report type here
		}> = [
			{ hardware: { gpu: "GTX 1050" } },
			{ hardware: { gpu: "GTX 1080" } },
			{ hardware: { gpu: "RTX 2080" } },
		];
		const result = getRandomGpuName(
			reports as PerformanceReport[]
		);
		expect(["GTX 1050", "GTX 1080", "RTX 2080"]).toContain(
			result
		);
	});
});
