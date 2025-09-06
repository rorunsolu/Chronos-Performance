import ReportCard from "@/components/Card/ReportCard";
import { useGameDetails } from "@/hooks/useGameDetails";
import { usePerformanceReportHook } from "@/hooks/usePerformanceReportHook";
import styles from "@/pages/Game/Game.module.css";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Timestamp } from "firebase/firestore";
import { Ban, Check } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
	Accordion,
	Badge,
	Button,
	Container,
	Fieldset,
	Group,
	Image,
	NumberInput,
	Select,
	SimpleGrid,
	Stack,
	Switch,
	Text,
	Title,
} from "@mantine/core";
import StarRating from "@/components/Star Rating/StarRating";
import type { GameInfo } from "@/hooks/useGameDetails";
import type {
	GPUOptions,
	UpscalingQuality,
	CPUOptions,
	UpscalingMethod,
	Resolution,
	AspectRatio,
	AverageGraphicsPreset,
	RAMOptions,
	VRAMOptions,
	StorageType,
	HardwareType,
	PerformanceReport,
} from "@/contexts/PerformanceReportContext";
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

	const gameSpecificReports = reports.filter(
		(report) => report.IgdbGameId === id
	);

	const { data, status, error } = useGameDetails(id);

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
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
			const report: PerformanceReport = {
				IgdbGameId: id ? id : "",
				IgdbGameName: data ? data[0]?.name : "",
				reportId: uuidv4(),
				userId: "",
				createdAt: new Date() as unknown as Timestamp,

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
		<Container
			size="md"
			my="lg"
		>
			{data.map((game: GameInfo) => (
				<Stack key={game.id}>
					<Group>
						<div className="relative">
							<Image
								src={
									game.cover
										? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
										: "https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png"
								}
								alt={`The game cover for ${game.name}`}
								className={styles.cover}
								bdrs="sm"
							/>
							<StarRating rating={game.rating} />
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
									{game.genres.map((g) => (
										<Badge
											variant="default"
											radius="sm"
											key={g.name}
										>
											{g.name}
										</Badge>
									))}
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
					<Stack gap="5">
						{game.release_dates?.length && (
							<Text size="sm">
								Release Date: {game.release_dates[0].y}
							</Text>
						)}
						{game.game_engines?.length && (
							<Group gap="xs">
								{game.game_engines.map((engine) => (
									<Text
										size="sm"
										key={engine.name}
									>
										Game Engine: {""}
										{engine.name}
									</Text>
								))}
							</Group>
						)}
					</Stack>

					<Accordion
						transitionDuration={0}
						className={styles.accordion}
					>
						<Accordion.Item
							value="submitreport"
							className={styles.item}
						>
							<Accordion.Control className={styles.control}>
								<Button
									variant="outline"
									color="teal"
									mt="5"
									mb="sm"
								>
									Start a report
								</Button>
							</Accordion.Control>
							<Accordion.Panel>
								<form
									onSubmit={form.onSubmit(() => {
										handleSubmit(form.values);
									})}
								>
									<Stack
										gap="lg"
										mt="lg"
									>
										<Switch
											{...form.getInputProps(
												"settings.upscaling",
												{ type: "checkbox" }
											)}
											label="Upscaling Enabled?"
										/>
										<Fieldset
											legend="Performance Metrics"
											variant="unstyled"
										>
											<Stack mt="0">
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
												/>
											</Stack>
										</Fieldset>

										<Fieldset
											disabled={
												!form.values.settings.upscaling
											}
											legend="Upscaling"
											variant="unstyled"
										>
											<Stack mt="0">
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
											<Stack mt="0">
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
									</Stack>

									<Button
										type="submit"
										mt="lg"
										color="teal"
									>
										Submit
									</Button>
								</form>
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>

					<Stack>
						<Title
							order={4}
							fw={500}
						>
							Performance Reports
						</Title>

						{gameSpecificReports.length === 0 ? (
							<Text>No reports yet. Be the first!</Text>
						) : (
							<SimpleGrid>
								{gameSpecificReports.map(
									(report: PerformanceReport) => (
										<ReportCard
											key={report.reportId}
											report={report}
										/>
									)
								)}
							</SimpleGrid>
						)}
					</Stack>
				</Stack>
			))}
		</Container>
	) : status === "pending" ? (
		<div>Loading...</div>
	) : status === "error" ? (
		<div>Error: {(error as Error).message}</div>
	) : null;
};

export default Game;
