import { UserAuth } from "@/auth/AuthContext";
import cardStyles from "@/components/Card/ReportCard.module.css";
import { useGameDetails } from "@/hooks/useGameDetails";
import dayjs from "dayjs";
import { User } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Accordion,
	Divider,
	Group,
	Paper,
	Stack,
	Text,
	Image,
} from "@mantine/core";
import type { PerformanceReport } from "@/contexts/PerformanceReportContext";

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
	const { allUsers, fetchUsers } = UserAuth();

	const authorAvatar =
		allUsers.find(
			(userAcc) => report.userId === userAcc.accUid
		)?.accPhotoURL || null;

	useEffect(() => {
		const fetchData = async () => {
			await fetchUsers();
		};

		fetchData();
	}, []);

	return (
		<Paper
			withBorder
			radius="md"
			className={cardStyles.comment}
		>
			<Group
				onClick={() => {
					{
						!isProfilePage &&
							navigate(
								`/profile/${allUsers.find((userAcc) => userAcc.accUid === report.userId)?.accUrlId}`
							);
					}
				}}
				className={
					isProfilePage ? "" : "cursor-pointer max-w-fit"
				}
			>
				{!isProfilePage && (
					<Paper
						withBorder
						radius={100}
						className="overflow-hidden"
						w={40}
						h={40}
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

				<div>
					{isProfilePage ? (
						<Group justify="flex-start">
							<img
								src={
									gameDetails && gameDetails[0]?.cover
										? `https://images.igdb.com/igdb/image/upload/t_cover_big/${gameDetails[0].cover.image_id}.jpg`
										: "https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png"
								}
								alt={`Image of ${gameDetails && gameDetails[0]?.name}`}
								width={40}
								height={50}
								style={{ borderRadius: 8 }}
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
									{dayjs(report.createdAt.toDate()).format(
										"MMMM D, YYYY"
									)}
								</Text>
							</Stack>
						</Group>
					) : (
						<>
							<Text fz="sm">
								{
									allUsers.find(
										(userAcc) =>
											userAcc.accUid === report.userId
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
				</div>
			</Group>
			<Stack gap="1">
				<Stack
					gap="5"
					mt="md"
				>
					{report.metrics.averageFps && (
						<Group gap="5">
							<Text fz="sm">Average FPS:</Text>
							<Text fz="sm">
								{report.metrics.averageFps}FPS
							</Text>
						</Group>
					)}
					{report.metrics.minFps && (
						<Group gap="5">
							<Text fz="sm">1% Lows:</Text>
							<Text
								fz="sm"
								c="white"
							>
								{report.metrics.minFps}FPS
							</Text>
						</Group>
					)}
					{report.metrics.maxFps && (
						<Group gap="5">
							<Text fz="sm">Max FPS:</Text>
							<Text fz="sm">
								{report.metrics.maxFps}FPS
							</Text>
						</Group>
					)}
				</Stack>

				<Accordion
					transitionDuration={0}
					chevronPosition="left"
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
						>
							<Group justify="flex-start">
								<Text size="sm">Expand</Text>
							</Group>
						</Accordion.Control>
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
