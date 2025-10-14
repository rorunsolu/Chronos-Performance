import { UserAuth } from "@/auth/AuthContext";
import cardStyles from "@/components/Card/ReportCard.module.css";
import { useGameDetails } from "@/hooks/useGameDetails";
import { usePerformanceReportHook } from "@/hooks/usePerformanceReportHook";
import dayjs from "dayjs";
import { ChevronsUpDown, Trash, User } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Group,
	Image,
	Menu,
	Paper,
	Progress,
	Stack,
	Text,
} from "@mantine/core";
import type { PerformanceReport } from "@/common/types";

const ReportCard = ({
	report,
	isProfilePage = false,
}: {
	report: PerformanceReport;
	isProfilePage?: boolean;
}) => {
	"use no memo";
	const { data: gameDetails } = useGameDetails(
		report.IgdbGameId
	);

	const navigate = useNavigate();
	const { allUsers, fetchUsers, user } = UserAuth();
	const { deleteReport } = usePerformanceReportHook();

	const reportOwner = allUsers.find(
		(account) => account.userId === report.userId
	);

	const authorAvatar =
		allUsers.find(
			(userAcc) => report.userId === userAcc.userId
		)?.accPhotoURL || null;

	useEffect(() => {
		const fetchData = async () => {
			await fetchUsers();
		};

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Paper className={cardStyles.comment}>
			<Group
				onClick={() => {
					if (!isProfilePage) {
						navigate(
							`/profile/${allUsers.find((userAcc) => userAcc.userId === report.userId)?.accUrlId}`
						);
					}
				}}
				className={
					isProfilePage ? "" : "cursor-pointer max-w-fit"
				}
			>
				{!isProfilePage && (
					<Paper
						radius={100}
						className="overflow-hidden"
						w={35}
						h={35}
						p={0}
					>
						{authorAvatar ? (
							<Image
								src={authorAvatar}
								content="no-referrer"
								referrerPolicy="no-referrer"
							/>
						) : (
							<Paper
								withBorder
								radius={100}
								p="xs"
							>
								<User size={16} />
							</Paper>
						)}
					</Paper>
				)}

				<Group w={isProfilePage ? "100%" : "auto"}>
					{isProfilePage ? (
						<div className="w-full flex justify-between items-center">
							<Group>
								<img
									src={
										gameDetails && gameDetails[0]?.cover
											? `https://images.igdb.com/igdb/image/upload/t_cover_big/${gameDetails[0].cover.image_id}.jpg`
											: "https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png"
									}
									alt={`${gameDetails && gameDetails[0]?.name}`}
									width={40}
									height={50}
									style={{ borderRadius: 5 }}
								/>
								<Stack gap="0">
									<Text
										fz="md"
										fw={500}
									>
										{report.IgdbGameName}
									</Text>
									<Text
										fz="xs"
										c="dimmed"
									>
										Posted:{" "}
										{dayjs(
											report.createdAt.toDate()
										).format("MMMM D, YYYY")}
									</Text>
								</Stack>
							</Group>

							{reportOwner?.userId === user?.uid && (
								<Menu
									shadow="md"
									width={120}
								>
									<Menu.Target>
										<Button
											variant="default"
											p="0"
											w={30}
											h={30}
										>
											<ChevronsUpDown size={14} />
										</Button>
									</Menu.Target>

									<Menu.Dropdown>
										<Menu.Item
											fw={400}
											leftSection={
												<Trash
													size={14}
													strokeWidth={3}
												/>
											}
											onClick={() => {
												deleteReport(report.id);
											}}
										>
											Delete
										</Menu.Item>
									</Menu.Dropdown>
								</Menu>
							)}
						</div>
					) : (
						<Stack gap="0">
							<Text fz="sm">
								{
									allUsers.find(
										(userAcc) =>
											userAcc.userId === report.userId
									)?.accName
								}
							</Text>
							<Text
								fz="xs"
								c="dimmed"
							>
								{dayjs(report.createdAt.toDate()).format(
									"MMMM D, YYYY"
								)}
							</Text>
						</Stack>
					)}
				</Group>
			</Group>
			<Stack gap="1">
				<Stack
					gap="5"
					mt={-10}
				>
					<Group
						align="flex-end"
						justify="space-between"
						mt="md"
					>
						<Text
							fz="sm"
							fw={500}
						>
							Rating
						</Text>
						<div className="flex flex-row gap-1">
							<Text
								fz="sm"
								fw={600}
								c="teal"
								mt="sm"
							>
								{report.perfRating}
							</Text>

							<Text
								fz="sm"
								c="gray.7"
								fw={500}
								mt="sm"
							>
								out of 100
							</Text>
						</div>
					</Group>
					<Progress
						color="teal.5"
						radius="xs"
						size="xl"
						value={report.perfRating}
					/>
				</Stack>

				<Stack
					gap="5"
					mt="lg"
					justify="space-between"
				>
					{report.metrics.averageFps && (
						<Group justify="space-between">
							<Text fz="sm">Average FPS</Text>
							<Paper
								withBorder={false}
								p="sm"
								w={30}
								h={30}
								className={cardStyles.stat}
							>
								<Text
									fz="sm"
									fw={500}
								>
									{report.metrics.averageFps}
								</Text>
							</Paper>
						</Group>
					)}

					{report.metrics.minFps && (
						<Group justify="space-between">
							<Text fz="sm">Minimum FPS</Text>
							<Paper
								withBorder={false}
								p="sm"
								w={30}
								h={30}
								className={cardStyles.stat}
							>
								<Text
									fz="sm"
									fw={500}
								>
									{report.metrics.minFps}
								</Text>
							</Paper>
						</Group>
					)}

					{report.metrics.maxFps && (
						<Group justify="space-between">
							<Text fz="sm">Maximum FPS</Text>
							<Paper
								withBorder={false}
								p="sm"
								w={30}
								h={30}
								className={cardStyles.stat}
							>
								<Text
									fz="sm"
									fw={500}
								>
									{report.metrics.maxFps}
								</Text>
							</Paper>
						</Group>
					)}
				</Stack>
			</Stack>
		</Paper>
	);
};

export default ReportCard;
