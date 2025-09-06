import cardStyles from "@/components/Card/ReportCard.module.css";
import { useGameDetails } from "@/hooks/useGameDetails";
import dayjs from "dayjs";
import { User } from "lucide-react";
import {
	Accordion,
	Divider,
	Group,
	Paper,
	Stack,
	Text,
} from "@mantine/core";
import type { PerformanceReport } from "@/contexts/PerformanceReportContext";

const ReportCard = ({
	report,
	isProfilePage = false,
}: {
	report: PerformanceReport;
	isProfilePage?: boolean;
}) => {
	const { data: gameDetails } = useGameDetails(
		report.IgdbGameId
	);

	return (
		<Paper
			withBorder
			radius="md"
			className={cardStyles.comment}
		>
			<Group>
				{!isProfilePage && (
					<Paper
						withBorder
						radius="xl"
						p="xs"
					>
						<User size={16} />
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
							<Text fz="sm">User</Text>
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
