import cardStyles from "@/components/Card/ReportCard.module.css";
import { useGameDetails } from "@/hooks/useGameDetails";
import { usePerformanceReportHook } from "@/hooks/usePerformanceReportHook";
import { UserAuth } from "@/hooks/UserAuthHook";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	ChevronsUpDown,
	ExternalLink,
	Trash,
	User,
} from "lucide-react";
import {
	Button,
	Group,
	Image,
	Menu,
	Paper,
	Progress,
	Anchor,
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
			<Group className={isProfilePage ? "max-w-fit" : ""}>
				{!isProfilePage && (
					<Paper
						bdrs="sm"
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
								bdrs="sm"
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
										maw={200}
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
						<Group
							justify="space-between"
							miw="100%"
							className="min-w-full"
						>
							<Stack gap="0">
								<Anchor
									fz="sm"
									c="black"
									maw={150}
									onClick={() => {
										if (!isProfilePage) {
											navigate(
												`/profile/${allUsers.find((userAcc) => userAcc.userId === report.userId)?.accUrlId}`
											);
										}
									}}
								>
									{
										allUsers.find(
											(userAcc) =>
												userAcc.userId === report.userId
										)?.accName
									}
								</Anchor>
								<Text
									fz="xs"
									c="dimmed"
								>
									{dayjs(report.createdAt.toDate()).format(
										"MMMM D, YYYY"
									)}
								</Text>
							</Stack>

							<Button
								bdrs="sm"
								size="xs"
								px="xs"
								rightSection={<ExternalLink size={12} />}
								onClick={() =>
									navigate(`/report/${report.id}`)
								}
							>
								View Report
							</Button>
						</Group>
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
					gap="0"
					mt="lg"
					justify="space-between"
				>
					<Group>
						{report.hardware.gpu && (
							<Paper
								p="xs"
								w="fit-content"
								shadow="0"
								bdrs="sm"
							>
								<Text fz="xs">GPU</Text>

								<Text
									fz="sm"
									fw={500}
								>
									{report.hardware.gpu}
								</Text>
							</Paper>
						)}
						{report.hardware.cpu && (
							<Paper
								p="xs"
								w="fit-content"
								shadow="0"
								bdrs="sm"
							>
								<Text fz="xs">CPU</Text>

								<Text
									fz="sm"
									fw={500}
								>
									{report.hardware.cpu}
								</Text>
							</Paper>
						)}

						{report.metrics.averageFps && (
							<Paper
								p="xs"
								w="fit-content"
								shadow="0"
								bdrs="sm"
							>
								<Text fz="xs">Avg FPS</Text>

								<Text
									fz="sm"
									fw={500}
								>
									{report.metrics.averageFps}
								</Text>
							</Paper>
						)}
					</Group>
				</Stack>
			</Stack>
		</Paper>
	);
};

export default ReportCard;
