import { type PerformanceReport } from "@/common/types";

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
