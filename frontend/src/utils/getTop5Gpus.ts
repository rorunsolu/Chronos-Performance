import { type PerformanceReport } from "@/common/types";
export const getTop5Gpus = (
	reports: PerformanceReport[],
	gpuArray: string[]
) => {
	if (reports.length === 0) {
		return {};
	}

	// get the occurences of each gpu in the array
	const gpuCountMap = gpuArray.reduce<
		Record<string, number>
	>((accumulation, currentGpu) => {
		accumulation[currentGpu] =
			(accumulation[currentGpu] || 0) + 1;
		return accumulation;
	}, {});

	// sort the gpu's based on the number of occurences and return the top 5
	const sortedGpus = Object.keys(gpuCountMap)
		.sort((a, b) => gpuCountMap[b] - gpuCountMap[a])
		.slice(0, 5);

	const top5GpusForGame = sortedGpus.reduce(
		(accumulation, currentGpu) => ({
			...accumulation,
			[currentGpu]: gpuCountMap[currentGpu],
		}),
		{}
	);

	return top5GpusForGame;
};
