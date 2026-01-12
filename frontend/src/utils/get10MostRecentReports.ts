import { type PerformanceReport } from "@/common/types";

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
