import styles from "@/components/Sidebar/Sidebar.module.css";
import { usePerformanceReportHook } from "@/hooks/usePerformanceReportHook";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";
import {
	Badge,
	Group,
	Paper,
	Stack,
	Text,
} from "@mantine/core";
import {
	get10MostRecentReports,
	getReportedGpus,
} from "@/hooks/statisticsHook";

const Sidebar = () => {
	const { reports, fetchReports } =
		usePerformanceReportHook();
	const top5Gpus = getReportedGpus(reports);
	const recentReports = get10MostRecentReports(reports);

	useEffect(() => {
		const fetchData = async () => {
			await fetchReports();
		};

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Stack gap="0">
			<Stack m="md">
				<Text
					fw={600}
					size="md"
				>
					Top 5 GPUs
				</Text>
			</Stack>

			{top5Gpus.map((gpu, index) => (
				<Paper
					key={index}
					p="xs"
					shadow="0"
					bdrs={0}
					className={styles.gpu}
				>
					{index + 1}. {gpu}
				</Paper>
			))}

			<Stack m="md">
				<Text
					fw={600}
					size="md"
				>
					Recent Reports
				</Text>
			</Stack>

			{recentReports.map((report, index) => (
				<Paper
					key={index}
					p="xs"
					shadow="0"
					bdrs={0}
					className={styles.report}
				>
					<Group justify="space-between">
						<Stack gap={0}>
							<Text
								size="sm"
								c="dimmed"
							>
								{report.createdAt
									? formatDistanceToNow(
											report.createdAt.toDate(),
											{ addSuffix: true }
										)
									: "Unknown date"}
							</Text>

							<Text truncate>{report.IgdbGameName}</Text>
						</Stack>

						<Badge
							color={
								report.perfRating < 40
									? "red"
									: report.perfRating < 60
										? "yellow"
										: "green"
							}
							variant="filled"
							fw={500}
						>
							{report.perfRating} / 100
						</Badge>
					</Group>
				</Paper>
			))}
		</Stack>
	);
};

export default Sidebar;
