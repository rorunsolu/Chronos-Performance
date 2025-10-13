import { type PerformanceReport } from "@/common/types";

// for each report where the igdb game id matches the game id passed into the function
// calulate the average fps for that game by adding up all of the "metrics.averageFps" values
// and diviing it by the number of reports linked to that game

export const getGameAverageFps = (
	reports: PerformanceReport[],
	gameIdPassed: string
) => {
	if (reports.length === 0) {
		return 0;
	}

	let totalFps = 0;
	let numberOfReportsForThisGame = 0;

	for (const report of reports) {
		if (report.IgdbGameId === gameIdPassed) {
			totalFps += report.metrics.averageFps || 0;
			// continuosly add the average fps of each report to result in the value of the "totalFps" variable
			numberOfReportsForThisGame += 1;
			// for each report that contains the matching game ID "1" will be added to the "numberOfReportsForThisGame" variable
		}
	}

	const averageFPS4Game = Math.round(
		totalFps / numberOfReportsForThisGame
	);
	return averageFPS4Game;
};

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

// list of gpu's come fro firebase data or a locally defined array or the types from the GPUOptions type?

export const getAvgGamePerfRating = (
	reports: PerformanceReport[],
	gameIdPassed: string
) => {
	if (reports.length === 0) {
		return 0;
	}

	let totalPerfRating = 0 as number;
	let reportCount = 0 as number;

	for (const report of reports) {
		if (gameIdPassed === report.IgdbGameId) {
			totalPerfRating += report.perfRating;
			reportCount += 1;
		}
	}

	const averagePerfRating = Math.round(
		totalPerfRating / reportCount
	);

	return averagePerfRating;
};

export const getAvgPerfRatingForOtherGames = (
	reports: PerformanceReport[],
	excludeGameId: string
) => {
	if (reports.length === 0) {
		return 0;
	}

	let totalPerfRating = 0;
	let reportCount = 0;

	for (const report of reports) {
		if (report.IgdbGameId !== excludeGameId) {
			totalPerfRating += report.perfRating;
			reportCount += 1;
		}
	}

	if (reportCount === 0) {
		return 0; // No other games have reports
	}

	const allAveragePerfRating = Math.round(
		totalPerfRating / reportCount
	);
	return allAveragePerfRating;
};

// I need to get all the gpu's based on all reports submitted

export const getReportedGpus = (
	reports: PerformanceReport[]
) => {
	if (reports.length === 0) {
		return [];
	}

	const gpuArray = [] as string[];

	for (const report of reports) {
		if (report.hardware.gpu) {
			gpuArray.push(report.hardware.gpu);
		}
	}

	if (gpuArray.length === 0) {
		return [];
	}

	// Call getTop5Gpus and extract just the GPU names
	const top5GpusObject = getTop5Gpus(reports, gpuArray);
	return Object.keys(top5GpusObject); // Return array of GPU names
};

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

export const get10MostRecentReports = (
	reports: PerformanceReport[]
) => {
	if (reports.length === 0) {
		return [];
	}

	const sortedReports = [...reports].sort(
		(a, b) => b.createdAt.seconds - a.createdAt.seconds
	);

	return sortedReports.slice(0, 10);
};
