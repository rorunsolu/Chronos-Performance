import styles from "@/components/Sidebar/Sidebar.module.css";
import { usePerformanceReportHook } from "@/hooks/usePerformanceReportHook";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Divider,
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
			<Stack
				mx="md"
				mt="md"
				mb="xs"
			>
				<Text
					fw={600}
					size="md"
				>
					Top 5 GPUs
				</Text>
			</Stack>

			<Stack
				p="xs"
				gap="xs"
			>
				{top5Gpus.map((gpu, index) => (
					<Paper
						key={index}
						p="xs"
						bdrs="sm"
						className={styles.gpu}
					>
						{gpu}
					</Paper>
				))}
			</Stack>

			<Divider mt="sm" />

			<Stack
				mx="md"
				mt="md"
				mb="xs"
			>
				<Text
					fw={600}
					size="md"
				>
					Recent Reports
				</Text>
			</Stack>

			<Stack
				p="xs"
				gap="xs"
			>
				{recentReports.map((report, index) => (
					<Paper
						key={index}
						p="xs"
						bdrs="sm"
						className={styles.report}
						onClick={() => navigate(`/report/${report.id}`)}
					>
						<Group justify="space-between">
							<Stack gap={0}>
								<Text
									size="xs"
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
								variant="light"
								fw={500}
							>
								{report.perfRating} / 100
							</Badge>
						</Group>
					</Paper>
				))}
			</Stack>
		</Stack>
	);
};

export default Sidebar;
