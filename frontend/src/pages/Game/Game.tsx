import styles from "./Game.module.css";
import { usePerformanceReport } from "@/contexts/PerformanceReportContext";
import { useForm } from "@mantine/form";
import { Timestamp } from "firebase/firestore";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
	Accordion,
	Badge,
	Button,
	Code,
	Container,
	Fieldset,
	Group,
	NumberInput,
	Select,
	Stack,
	Switch,
	Text,
} from "@mantine/core";
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
import {
	keepPreviousData,
	useQuery,
} from "@tanstack/react-query";

type GameInfo = {
	id: number;
	name: string;
	cover: {
		image_id: string;
	};
	summary: string;
	rating: number;
	genres: {
		name: string;
	}[];
	url: string;
	game_engines: {
		name: string;
		logo?: string;
	}[];
	websites: {
		url: string;
		type: number;
	}[];
	release_dates: {
		y: number;
	}[];
};

const Game = () => {
	const { id } = useParams<{ id: string }>();
	const { createReport } = usePerformanceReport();

	const { data, status, error } = useQuery<GameInfo[]>({
		//* DATA REGARDING GAMES SHOULD ALWAYS BE AN ARRAY BRO FGS
		queryKey: ["gameInformation", id],
		queryFn: async () => {
			const response = await fetch(
				`/api/IGDBapi/gamepage/${id}`
			);
			if (!response.ok) {
				throw new Error(
					`Failed to fetch game: ${response.status}`
				);
			}
			return response.json();
		},
		placeholderData: keepPreviousData,
	});

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

	const handleSubmit = async (
		values: typeof form.values
	) => {
		try {
			const report: PerformanceReport = {
				IgdbGameId: id ? id : "",
				IgdbGameName: data ? data[0]?.name : "",
				reportId: "",
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
			alert("Report submitted successfully!");
		} catch (error) {
			console.error("Error submitting report:", error);
			alert("Failed to submit the report.");
		}
	};

	const [submittedValues, setSubmittedValues] = useState<
		typeof form.values | null
	>(null);

	const [checked, setChecked] = useState(false);

	return status === "success" ? (
		<Container
			size="lg"
			my="lg"
		>
			{data.map((game: GameInfo) => (
				<Stack key={game.id}>
					<Group>
						<img
							src={
								game.cover
									? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
									: "https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png"
							}
							alt={`The game cover for ${game.name}`}
							className={styles.cover}
						/>

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
						{typeof game.rating === "number" && (
							<Badge
								radius="sm"
								size="lg"
								mb="sm"
								variant="gradient"
								gradient={{
									from: "blue",
									to: "teal",
									deg: 200,
								}}
							>
								{Math.round(game.rating)} {""}/ {""}100
							</Badge>
						)}

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
						chevronSize={16}
						chevron={<ChevronsUpDown />}
						disableChevronRotation
						transitionDuration={0}
						className={styles.accordion}
					>
						<Accordion.Item
							value="instructions"
							className={styles.item}
						>
							<Accordion.Control
								className={styles.control}
								bdrs="sm"
							>
								<Text
									size="sm"
									c="white"
								>
									Submit a report
								</Text>
							</Accordion.Control>
							<Accordion.Panel>
								<form
									onSubmit={form.onSubmit(() => {
										setSubmittedValues(form.values);
										handleSubmit(form.values);
									})}
								>
									<Stack
										mt="md"
										gap="lg"
									>
										<Switch
											{...form.getInputProps(
												"settings.upscaling"
											)}
											label="Upscaling Enabled?"
											checked={checked}
											onChange={(event) =>
												setChecked(
													event.currentTarget.checked
												)
											}
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
											disabled={checked === false}
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

									<Text mt="md">Form values:</Text>
									<Code block>
										{JSON.stringify(form.values, null, 2)}
									</Code>

									<Text mt="md">Submitted values:</Text>
									<Code block>
										{submittedValues
											? JSON.stringify(
													submittedValues,
													null,
													2
												)
											: "–"}
									</Code>
								</form>
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
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
