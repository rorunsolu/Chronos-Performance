import { type PerformanceReport } from "@/common/types";
export const getRandomGpuName = (
	reports: PerformanceReport[]
) => {
	if (reports.length === 0) {
		return null;
	}

	const gpuArray = [] as string[];

	for (const report of reports) {
		if (!report.hardware.gpu) {
			return null;
		}

		if (report.hardware.gpu) {
			// if the gpuexists then add it to the array
			gpuArray.push(report.hardware.gpu);
		}
	}

	// since we need a random list having duplicate gpu's would be bad
	const uniqueGpus = Array.from(new Set(gpuArray));

	const randomGpu =
		uniqueGpus[(Math.random() * uniqueGpus.length) | 0];

	return randomGpu;
};
