import { type PerformanceReport } from "@/common/types";
export const getGpuAverageFps = (
	reports: PerformanceReport[],
	gpuname: string
) => {
	if (reports.length === 0) {
		return 0;
	}

	let totalFps = 0;
	let reportsWithGpu = 0;

	for (const report of reports) {
		if (report.hardware.gpu === gpuname) {
			totalFps += report.metrics.averageFps || 0;
			reportsWithGpu += 1;
		}
	}

	return reportsWithGpu > 0
		? Math.round(totalFps / reportsWithGpu)
		: 0;
};
