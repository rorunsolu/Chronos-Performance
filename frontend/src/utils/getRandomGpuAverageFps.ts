import { type PerformanceReport } from "@/common/types";
import { getGpuAverageFps } from "@/utils/getGpuAverageFps";

export const getRandomGpuAverageFps = (
	reports: PerformanceReport[],
	randomGpuName: string | null
) => {
	if (reports.length === 0) {
		return 0;
	}

	const fpsOfRandoGpu = getGpuAverageFps(
		reports,
		randomGpuName as string
	);

	return fpsOfRandoGpu;
};
