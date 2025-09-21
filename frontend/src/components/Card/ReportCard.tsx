import { UserAuth } from "@/auth/AuthContext";
import cardStyles from "@/components/Card/ReportCard.module.css";
import { useGameDetails } from "@/hooks/useGameDetails";
import { usePerformanceReportHook } from "@/hooks/usePerformanceReportHook";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	EllipsisVertical,
	Trash,
	User,
} from "lucide-react";
import {
	Accordion,
	Button,
	Divider,
	Group,
	Image,
	Menu,
	Paper,
	Stack,
	Text,
	Title,
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
								radius="xl"
								p="xs"
							>
								<User size={16} />
							</Paper>
						)}
					</Paper>
				)}

				<Group w="100%">
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
									width={200}
								>
									<Menu.Target>
										<Button
											variant="default"
											p="5"
										>
											<EllipsisVertical size={16} />
										</Button>
									</Menu.Target>

									<Menu.Dropdown>
										<Menu.Item
											fw={500}
											color="red"
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
											Delete Report
										</Menu.Item>
									</Menu.Dropdown>
								</Menu>
							)}
						</div>
					) : (
						<>
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
						</>
					)}
				</Group>
			</Group>
			<Stack gap="1">
				<Group
					gap="5"
					mt="lg"
					justify="space-between"
				>
					{report.metrics.averageFps && (
						<Stack gap="5">
							<Title fz="xl">
								{report.metrics.averageFps}
							</Title>
							<Text
								fz="xs"
								fw={600}
							>
								AVG FPS
							</Text>
						</Stack>
					)}
					<Divider
						size="sm"
						orientation="vertical"
					/>
					{report.metrics.minFps && (
						<Stack gap="5">
							<Title fz="xl">{report.metrics.minFps}</Title>
							<Text
								fz="xs"
								fw={600}
							>
								MIN FPS
							</Text>
						</Stack>
					)}
					<Divider
						size="sm"
						orientation="vertical"
					/>
					{report.metrics.maxFps && (
						<Stack gap="5">
							<Title fz="xl">{report.metrics.maxFps}</Title>
							<Text
								fz="xs"
								fw={600}
							>
								MAX FPS
							</Text>
						</Stack>
					)}
				</Group>

				<Accordion
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<Accordion.Item
						value="viewmore"
						className={cardStyles.accordion}
					>
						<Accordion.Control
							mt="lg"
							bdrs="sm"
							className={cardStyles.control}
						></Accordion.Control>
						<Accordion.Panel>
							<Stack
								gap="5"
								mt="5"
							>
								<Divider
									my="xs"
									label="Settings"
									labelPosition="left"
								/>
								<Group gap="5">
									<Text fz="sm">Upscaling:</Text>
									<Text fz="sm">
										{report.settings.upscaling
											? "Enabled"
											: "Disabled"}
									</Text>
								</Group>
								{report.settings.upscalingMethod && (
									<Group gap="5">
										<Text fz="sm">Upscaling Method:</Text>
										<Text fz="sm">
											{report.settings.upscalingMethod}
										</Text>
									</Group>
								)}
								{report.settings.UpscalingQuality && (
									<Group gap="5">
										<Text fz="sm">Upscaling Quality:</Text>
										<Text fz="sm">
											{report.settings.UpscalingQuality}
										</Text>
									</Group>
								)}
								<Group gap="5">
									<Text fz="sm">Aspect Ratio:</Text>
									<Text fz="sm">
										{report.settings.aspectRatio}
									</Text>
								</Group>
								<Group gap="5">
									<Text fz="sm">Resolution:</Text>
									<Text fz="sm">
										{report.settings.resolution}
									</Text>
								</Group>
								<Group gap="5">
									<Text fz="sm">Graphics Preset:</Text>
									<Text fz="sm">
										{report.settings.averageGraphicsPreset}
									</Text>
								</Group>
							</Stack>

							<Stack
								gap="5"
								mt="5"
							>
								<Divider
									my="xs"
									label="Hardware"
									labelPosition="left"
								/>

								<Group gap="5">
									<Text fz="sm">CPU:</Text>
									<Text fz="sm">{report.hardware.cpu}</Text>
								</Group>
								<Group gap="5">
									<Text fz="sm">GPU:</Text>
									<Text fz="sm">{report.hardware.gpu}</Text>
								</Group>
								<Group gap="5">
									<Text fz="sm">RAM:</Text>
									<Text fz="sm">{report.hardware.ram}</Text>
								</Group>
								<Group gap="5">
									<Text fz="sm">VRAM:</Text>
									<Text fz="sm">
										{report.hardware.vram}
									</Text>
								</Group>
								<Group gap="5">
									<Text fz="sm">Storage Type:</Text>
									<Text fz="sm">
										{report.hardware.storageType}
									</Text>
								</Group>
								<Group gap="5">
									<Text fz="sm">Hardware Type:</Text>
									<Text fz="sm">
										{report.hardware.hardwareType}
									</Text>
								</Group>
							</Stack>
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</Stack>
		</Paper>
	);
};

export default ReportCard;
