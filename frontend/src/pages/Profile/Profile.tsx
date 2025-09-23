import { UserAuth } from "@/auth/AuthContext";
import ReportCard from "@/components/Card/ReportCard";
import { usePerformanceReportHook } from "@/hooks/usePerformanceReportHook";
import { FileText, Heart, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	Card,
	Container,
	Group,
	Image,
	Paper,
	SimpleGrid,
	Stack,
	Text,
} from "@mantine/core";
import type { PerformanceReport } from "@/common/types";

const Profile = () => {
	const { accUrlId } = useParams<{ accUrlId: string }>();
	const { user, allUsers, getUserFavorites } = UserAuth();
	const { reports, fetchReports } =
		usePerformanceReportHook();

	const [profileFavorites, setProfileFavorites] = useState<
		number[]
	>([]);
	const [, setIsLoading] = useState(true);

	const specificUser = allUsers.find(
		(userAccount) => userAccount.accUrlId === accUrlId
	);

	const userSpecificReports = specificUser
		? reports.filter(
				(report) => report.userId === specificUser.userId
			)
		: [];

	useEffect(
		() => {
			const fetchData = async () => {
				setIsLoading(true);
				try {
					await fetchReports();
					if (specificUser) {
						const favs = await getUserFavorites(
							specificUser.userId
						);
						setProfileFavorites(favs);
					}
				} catch {
					throw new Error(
						"Failed to fetch user data. Please try again."
					);
				} finally {
					setIsLoading(false);
				}
			};

			fetchData();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			accUrlId,
			specificUser?.userId,
			fetchReports,
			getUserFavorites,
		]
	);

	return (
		<Container
			size="xs"
			my="md"
		>
			<Group
				justify="flex-start"
				mb="lg"
			>
				{user?.photoURL ? (
					<Paper
						radius={100}
						className="overflow-hidden"
						w={40}
						h={40}
						p={0}
					>
						<Image
							src={
								specificUser?.accPhotoURL
									? specificUser.accPhotoURL
									: user.photoURL
							}
							content="no-referrer"
							referrerPolicy="no-referrer"
						/>
					</Paper>
				) : (
					<Paper
						radius={100}
						className="overflow-hidden"
						w={35}
						h={35}
						p={0}
					>
						<User />
					</Paper>
				)}

				<div>
					<Text
						size="lg"
						fw={600}
					>
						{specificUser?.accName
							? specificUser.accName
							: user?.displayName ||
								"Display name not found"}
					</Text>
					<Text
						size="sm"
						c="dimmed"
					>
						{specificUser?.accEmail
							? specificUser.accEmail
							: user?.email || "Email not found"}
					</Text>
				</div>
			</Group>

			<SimpleGrid
				cols={{ base: 1, sm: 2 }}
				spacing="md"
				mb="lg"
			>
				<Card
					padding="md"
					withBorder
				>
					<Group>
						<FileText size={24} />
						<Stack gap="0">
							<Text fw={600}>
								{userSpecificReports.length}
							</Text>
							<Text
								size="sm"
								c="dimmed"
							>
								Performance Reports
							</Text>
						</Stack>
					</Group>
				</Card>
				<Card
					padding="md"
					withBorder
				>
					<Group>
						<Heart size={24} />
						<Stack gap="0">
							<Text fw={600}>
								{profileFavorites.length}
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

			<Stack
				gap="lg"
				mt="xl"
			>
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
