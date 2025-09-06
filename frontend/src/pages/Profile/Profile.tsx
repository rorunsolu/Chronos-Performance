import { UserAuth } from "@/auth/AuthContext";
import ReportCard from "@/components/Card/ReportCard";
import { usePerformanceReportHook } from "@/hooks/usePerformanceReportHook";
import styles from "@/pages/Profile/Profile.module.css";
import { FileText, Heart, User } from "lucide-react";
import { useEffect } from "react";
import {
	Card,
	Container,
	Divider,
	Group,
	Image,
	Paper,
	SimpleGrid,
	Stack,
	Text,
} from "@mantine/core";
import type { PerformanceReport } from "@/contexts/PerformanceReportContext";

const Profile = () => {
	const { user } = UserAuth();
	const { reports, fetchReports } =
		usePerformanceReportHook();

	const userSpecificReports = reports.filter(
		(report) => report.userId === user?.uid
	);

	const userStats = {
		favoritedGames: 8,
	};

	useEffect(() => {
		const fetchData = async () => {
			await fetchReports();
		};

		fetchData();
	}, []);

	return (
		<Container
			size="xs"
			my="lg"
		>
			<Group
				justify="flex-start"
				mb="lg"
			>
				{user?.photoURL ? (
					<Paper
						withBorder
						className={styles.avatar}
					>
						<Image
							src={user.photoURL}
							content="no-referrer"
							referrerPolicy="no-referrer"
						/>
					</Paper>
				) : (
					<Paper
						radius="xl"
						withBorder
					>
						<User />
					</Paper>
				)}

				<div>
					<Text
						size="lg"
						fw={700}
					>
						{user?.displayName || "Display name not found"}
					</Text>
					<Text
						size="sm"
						c="dimmed"
					>
						{user?.email || "Email not found"}
					</Text>
				</div>
			</Group>

			<SimpleGrid
				cols={{ base: 1, sm: 2 }}
				spacing="md"
				mb="lg"
			>
				<Card
					shadow="sm"
					padding="md"
					withBorder
				>
					<Group>
						<FileText size={24} />
						<Stack gap="0">
							<Text fw={700}>
								{userSpecificReports.length}
							</Text>
							<Text
								size="sm"
								c="dimmed"
							>
								Reports Posted
							</Text>
						</Stack>
					</Group>
				</Card>
				<Card
					shadow="sm"
					padding="md"
					withBorder
				>
					<Group>
						<Heart size={24} />
						<Stack gap="0">
							<Text fw={700}>
								{userStats.favoritedGames}
							</Text>
							<Text
								size="sm"
								c="dimmed"
							>
								Favorited Games
							</Text>
						</Stack>
					</Group>
				</Card>
			</SimpleGrid>

			<Divider
				my="lg"
				mt="xl"
			/>

			<Stack gap="md">
				<Text
					size="md"
					fw={500}
				>
					Performance Reports
				</Text>
				{userSpecificReports.length === 0 ? (
					<Text c="dimmed">
						You have not posted any performance reports yet.
					</Text>
				) : (
					userSpecificReports.map(
						(report: PerformanceReport) => (
							<ReportCard
								key={report.reportId}
								report={report}
								isProfilePage={true}
							/>
						)
					)
				)}
			</Stack>
		</Container>
	);
};

export default Profile;
