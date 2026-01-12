import { type PerformanceReport } from "@/common/types";

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

	if (numberOfReportsForThisGame === 0) {
		return 0;
	}

	const averageFPS4Game = Math.round(
		totalFps / numberOfReportsForThisGame
	);
	return averageFPS4Game;
};
