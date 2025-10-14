import styles from "@/components/Sidebar/Sidebar.module.css";
import { usePerformanceReportHook } from "@/hooks/usePerformanceReportHook";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			await fetchReports();
		};

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const top5Gpus = getReportedGpus(reports);
	const recentReports = get10MostRecentReports(reports);

	const getRatingColor = (rating: number) => {
		if (rating > 70) return "green.5";
		if (rating > 50) return "yellow.5";
		if (rating > 40) return "orange.5";
		return "red.7";
	};
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
					onClick={() => navigate(`/report/${report.id}`)}
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
							color={getRatingColor(report.perfRating)}
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
