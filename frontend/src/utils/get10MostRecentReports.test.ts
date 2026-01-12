import { get10MostRecentReports } from "@/utils/get10MostRecentReports";
import { type PerformanceReport } from "@/common/types";
import { Timestamp } from "firebase/firestore";

describe("get10MostRecentReports", () => {
	it("returns an empty array when there are no reports", () => {
		expect(get10MostRecentReports([])).toEqual([]);
	});

	it("returns a report list newest 1st", () => {
		const reports: Pick<PerformanceReport, "createdAt">[] =
			[
				{ createdAt: { seconds: 134 } as Timestamp },
				{ createdAt: { seconds: 135 } as Timestamp },
				{ createdAt: { seconds: 136 } as Timestamp },
			];

		const result = get10MostRecentReports(
			reports as PerformanceReport[]
		);

		expect(result).toEqual([
			reports[2],
			reports[1],
			reports[0],
		]);
	});
});
