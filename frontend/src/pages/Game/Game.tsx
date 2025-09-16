import { UserAuth } from "@/auth/AuthContext";
import ReportCard from "@/components/Card/ReportCard";
import { useGameDetails } from "@/hooks/useGameDetails";
import { usePerformanceReportHook } from "@/hooks/usePerformanceReportHook";
import styles from "@/pages/Game/Game.module.css";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Timestamp } from "firebase/firestore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
	Badge,
	Button,
	Collapse,
	Container,
	Fieldset,
	Group,
	Image,
	NumberInput,
	Paper,
	Select,
	Skeleton,
	Slider,
	Stack,
	Switch,
	Text,
	Title,
} from "@mantine/core";
import {
	Ban,
	Calendar1,
	Check,
	Wrench,
} from "lucide-react";
import StarRating from "@/components/Star Rating/StarRating";
import type { GameInfo } from "@/hooks/useGameDetails";
import type { PerformanceReport } from "@/common/types";
import type {
	GPUOptions,
	VRAMOptions,
	RAMOptions,
	CPUOptions,
	StorageType,
	HardwareType,
	AspectRatio,
	Resolution,
	AverageGraphicsPreset,
	UpscalingMethod,
	UpscalingQuality,
} from "@/common/types";
import {
	AspectRatios,
	Resolutions,
	AverageGraphicsPresets,
	RAMs,
	VRAMs,
	StorageTypes,
	HardwareTypes,
	UpscalingMethods,
	GPUs,
	CPUs,
	UpscalingQualitys,
} from "../../common";

const Game = () => {
	const { id } = useParams<{ id: string }>();
	const { createReport, reports, fetchReports } =
		usePerformanceReportHook();
	const [opened, { toggle }] = useDisclosure(false);
	const gameSpecificReports = reports.filter(
		(report) => report.IgdbGameId === id
	);
	const { user } = UserAuth();

	const { data, status, error } = useGameDetails(id);

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			perfRating: undefined as number | undefined,
			metrics: {
				averageFps: undefined as number | undefined,
				minFps: undefined as number | undefined,
				maxFps: undefined as number | undefined,
			},
			settings: {
				upscaling: false,
				upscalingMethod: undefined as
					| UpscalingMethod
					| undefined,
				UpscalingQuality: undefined as
					| UpscalingQuality
					| undefined,
				aspectRatio: undefined as AspectRatio | undefined,
				resolution: undefined as Resolution | undefined,
				averageGraphicsPreset: undefined as
					| AverageGraphicsPreset
					| undefined,
			},
			hardware: {
				cpu: undefined as CPUOptions | undefined,
				gpu: undefined as GPUOptions | undefined,
				ram: undefined as RAMOptions | undefined,
				vram: undefined as VRAMOptions | undefined,
				storageType: undefined as StorageType | undefined,
				hardwareType: undefined as HardwareType | undefined,
			},
		},
	});

	const handleSuccessNotification = () => {
		notifications.show({
			title: "Report Submitted",
			message:
				"Your report has been submitted successfully!",
			color: "teal",
			icon: <Check />,
		});
	};

	const handleErrorNotification = () => {
		notifications.show({
			title: "Report Submission Failed",
			message: "There was an error submitting your report.",
			color: "red",
			icon: <Ban />,
		});
	};

	const handleSubmit = async (
		values: typeof form.values
	) => {
		try {
			const report: Omit<PerformanceReport, "id"> = {
				IgdbGameId: id ? id : "",
				IgdbGameName: data ? data[0]?.name : "",
				reportId: uuidv4(),
				userId: "",
				createdAt: new Date() as unknown as Timestamp,

				perfRating: Number(values.perfRating),

				metrics: {
					averageFps: Number(values.metrics.averageFps),
					minFps: values.metrics.minFps
						? Number(values.metrics.minFps)
						: undefined,
					maxFps: values.metrics.maxFps
						? Number(values.metrics.maxFps)
						: undefined,
				},
				settings: {
					upscaling: values.settings.upscaling,
					upscalingMethod:
						values.settings.upscalingMethod || undefined,
					UpscalingQuality:
						values.settings.UpscalingQuality || undefined,
					aspectRatio: values.settings
						.aspectRatio as AspectRatio,
					resolution: values.settings
						.resolution as Resolution,
					averageGraphicsPreset: values.settings
						.averageGraphicsPreset as AverageGraphicsPreset,
				},
				hardware: {
					cpu: values.hardware.cpu as CPUOptions,
					gpu: values.hardware.gpu as GPUOptions,
					ram: values.hardware.ram as RAMOptions,
					vram: values.hardware.vram as VRAMOptions,
					storageType: values.hardware
						.storageType as StorageType,
					hardwareType: values.hardware
						.hardwareType as HardwareType,
				},
			};
			await createReport(report);
			handleSuccessNotification();
		} catch (error) {
			handleErrorNotification();
			throw new Error("Failed to create report");
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			await fetchReports();
		};

		fetchData();
	}, []);

	return status === "success" ? (
		<>
			<Container
				size="md"
				my="lg"
			>
				{data?.map((game: GameInfo) => (
					<Stack key={game.id}>
						<Group>
							<div className="relative w-full sm:mb-8">
								<img
									src={
										game.cover
											? `https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${game.cover.image_id}.jpg`
											: "https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png"
									}
									alt={`The game cover for ${game.name}`}
									className="hidden absolute top-[-20px] left-0 min-w-[100%] max-h-[300px] object-cover z-0 sm:block w-screen"
								/>
								<div className="relative max-w-fit sm:top-6 sm:left-6 ">
									<Image
										src={
											game.cover
												? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
												: "https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png"
										}
										alt={`The game cover for ${game.name}`}
										className="relative z-10 max-w-fit"
									/>
									<StarRating rating={game.rating} />
								</div>
							</div>

							<Stack gap="xs">
								<Text
									fw={600}
									size="xl"
								>
									{game.name || "Game title not found"}
								</Text>

								{game.genres?.length && (
									<Group
										gap="xs"
										mb="sm"
									>
										{game.game_engines?.length && (
											<Group gap="xs">
												{game.game_engines.map(
													(engine, index) => (
														<Badge
															key={index}
															leftSection={
																<Wrench size={14} />
															}
															className={styles.badge}
														>
															<div className="ml-1">
																{engine.name}
															</div>
														</Badge>
													)
												)}
											</Group>
										)}
										{game.release_dates?.length && (
											<Badge
												className={styles.badge}
												leftSection={
													<Calendar1 size={14} />
												}
											>
												<div className="ml-1">
													{game.release_dates[0].y}
												</div>
											</Badge>
										)}
										{game.genres?.length && (
											<Group gap="xs">
												{game.genres.map((g) => (
													<Badge
														key={g.name}
														className={styles.badge}
													>
														{g.name}
													</Badge>
												))}
											</Group>
										)}
									</Group>
								)}
								{game.summary && (
									<Text
										size="sm"
										className={styles.summary}
									>
										{game.summary}
									</Text>
								)}
							</Stack>
						</Group>

						<Button
							mt="5"
							size="md"
							variant="default"
							onClick={toggle}
							maw="fit-content"
							disabled={!user}
						>
							Start a report
						</Button>

						<Collapse in={opened}>
							<Paper>
								<form
									onSubmit={form.onSubmit(() => {
										handleSubmit(form.values);
									})}
								>
									<Stack gap="lg">
										<Switch
											{...form.getInputProps(
												"settings.upscaling",
												{ type: "checkbox" }
											)}
											label="Upscaling Enabled?"
											defaultChecked={false}
										/>
										<Fieldset
											disabled={
												!form.values.settings.upscaling
											}
											hidden={
												!form.values.settings.upscaling
											}
											legend="Upscaling"
											variant="unstyled"
										>
											<Stack>
												<Select
													{...form.getInputProps(
														"settings.upscalingMethod"
													)}
													placeholder="Upscaling Method"
													label="Upscaling Method"
													data={UpscalingMethods}
													clearable
													checkIconPosition="right"
													withAsterisk
												/>
												<Select
													{...form.getInputProps(
														"settings.UpscalingQuality"
													)}
													placeholder="Upscaling Quality"
													label="Upscaling Quality"
													data={UpscalingQualitys}
													clearable
													checkIconPosition="right"
													withAsterisk
												/>
											</Stack>
										</Fieldset>
										<Fieldset
											legend="Performance Metrics"
											variant="unstyled"
										>
											<Stack>
												<NumberInput
													{...form.getInputProps(
														"metrics.averageFps"
													)}
													placeholder="Average FPS"
													label="Average FPS"
													withAsterisk
													suffix="FPS"
													allowNegative={false}
													allowDecimal={false}
													hideControls
													max={600}
												/>
												<NumberInput
													{...form.getInputProps(
														"metrics.minFps"
													)}
													placeholder="Minimum FPS"
													label="Minimum FPS"
													suffix="FPS"
													allowNegative={false}
													allowDecimal={false}
													hideControls
													max={600}
												/>
												<NumberInput
													{...form.getInputProps(
														"metrics.maxFps"
													)}
													placeholder="Maximum FPS"
													label="Maximum FPS"
													suffix="FPS"
													allowNegative={false}
													allowDecimal={false}
													hideControls
													max={600}
												/>
											</Stack>
										</Fieldset>
										<Fieldset
											legend="Settings"
											variant="unstyled"
										>
											<Stack>
												<Select
													{...form.getInputProps(
														"settings.aspectRatio"
													)}
													placeholder="Aspect Ratio"
													label="Aspect Ratio"
													data={AspectRatios}
													clearable
													checkIconPosition="right"
													withAsterisk
												/>
												<Select
													{...form.getInputProps(
														"settings.resolution"
													)}
													placeholder="Resolution"
													label="Resolution"
													data={Resolutions}
													clearable
													checkIconPosition="right"
													withAsterisk
												/>
												<Select
													{...form.getInputProps(
														"settings.averageGraphicsPreset"
													)}
													placeholder="Graphics Preset"
													label="Graphics Preset"
													data={AverageGraphicsPresets}
													clearable
													checkIconPosition="right"
													withAsterisk
												/>
											</Stack>
										</Fieldset>
										<Fieldset
											legend="Hardware"
											variant="unstyled"
										>
											<Stack>
												<Select
													{...form.getInputProps(
														"hardware.cpu"
													)}
													placeholder="CPU"
													label="CPU"
													data={CPUs}
													clearable
													searchable
													checkIconPosition="right"
													withAsterisk
												/>
												<Select
													{...form.getInputProps(
														"hardware.gpu"
													)}
													placeholder="GPU"
													label="GPU"
													data={GPUs}
													clearable
													searchable
													checkIconPosition="right"
													withAsterisk
												/>
												<Select
													{...form.getInputProps(
														"hardware.ram"
													)}
													placeholder="RAM"
													label="RAM"
													data={RAMs}
													clearable
													checkIconPosition="right"
													withAsterisk
												/>
												<Select
													{...form.getInputProps(
														"hardware.vram"
													)}
													placeholder="VRAM"
													label="VRAM"
													data={VRAMs}
													clearable
													checkIconPosition="right"
													withAsterisk
												/>
												<Select
													{...form.getInputProps(
														"hardware.storageType"
													)}
													placeholder="Storage Type"
													label="Storage Type"
													data={StorageTypes}
													clearable
													checkIconPosition="right"
													withAsterisk
												/>
												<Select
													{...form.getInputProps(
														"hardware.hardwareType"
													)}
													placeholder="Hardware Type"
													label="Hardware Type"
													data={HardwareTypes}
													clearable
													checkIconPosition="right"
													withAsterisk
												/>
											</Stack>
										</Fieldset>
										<Fieldset
											legend="Overall Performance Rating"
											variant="unstyled"
											mb="md"
										>
											<Slider
												{...form.getInputProps(
													"perfRating"
												)}
												color="teal"
												defaultValue={0}
												thumbSize={20}
												mt="sm"
												maw={300}
											/>
										</Fieldset>
									</Stack>

									<Button
										type="submit"
										mt="lg"
										color="teal"
									>
										Submit
									</Button>
								</form>
							</Paper>
						</Collapse>

						<Stack mt="md">
							<Title
								order={4}
								fw={500}
								size="xl"
								mb="xs"
							>
								Performance Reports
							</Title>

							{gameSpecificReports.length === 0 ? (
								<Text mt="-8">
									No reports yet. Be the first!
								</Text>
							) : (
								<div className={styles.grid}>
									{gameSpecificReports.map(
										(report: PerformanceReport) => (
											<ReportCard
												key={report.id}
												report={report}
											/>
										)
									)}
								</div>
							)}
						</Stack>
					</Stack>
				))}
			</Container>
		</>
	) : status === "pending" ? (
		<Container
			size="md"
			my="lg"
		>
			<Stack gap="5">
				<Skeleton
					height={300}
					width={"100%"}
					maw={220}
					radius="md"
					mb="md"
				/>
				<Skeleton
					height={20}
					radius="md"
					width="50%"
				/>
				<Skeleton
					height={20}
					mt={6}
					radius="md"
				/>
				<Skeleton
					height={20}
					mt={6}
					width="70%"
					radius="md"
				/>
			</Stack>
		</Container>
	) : status === "error" ? (
		<Container
			size="md"
			my="lg"
		>
			<Text c="red">Error: {error?.message}</Text>
		</Container>
	) : null;
};

export default Game;
