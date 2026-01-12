import { type PerformanceReport } from "@/common/types";
export const getAvgGamePerfRating = (
	reports: PerformanceReport[],
	gameIdPassed: string
) => {
	if (reports.length === 0) {
		return 0;
	}

	let totalPerfRating = 0;
	let reportCount = 0;

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
