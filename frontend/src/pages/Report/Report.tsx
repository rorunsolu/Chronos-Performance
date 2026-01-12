import { db } from "@/auth/Firebase";
import { useGameDetails } from "@/hooks/useGameDetails";
import Error from "@/pages/Error/Error";
import { doc, getDoc } from "firebase/firestore";
import { Annoyed, Frown, Meh, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
	Anchor,
	Badge,
	Breadcrumbs,
	Container,
	Group,
	Paper,
	Stack,
	Table,
	Text,
} from "@mantine/core";
import { type PerformanceReport } from "@/common/types";

const Report = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [report, setReport] = useState<PerformanceReport>();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const getRatingColor = (rating: number) => {
		if (rating > 70) return "green.5";
		if (rating > 50) return "yellow.5";
		if (rating > 40) return "orange.5";
		return "red.7";
	};

	const getRatingIcon = (rating: number) => {
		if (rating > 70)
			return (
				<Smile
					color="white"
					strokeWidth={2}
				/>
			);
		if (rating > 50)
			return (
				<Meh
					color="white"
					strokeWidth={2}
				/>
			);
		if (rating > 40)
			return (
				<Frown
					color="white"
					strokeWidth={2}
				/>
			);
		return (
			<Annoyed
				color="white"
				strokeWidth={2}
			/>
		);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!id) {
					setLoading(false);
					return;
				}

				const docRef = doc(db, "reports", id);
				const docSnapshot = await getDoc(docRef);

				if (!docSnapshot.exists()) {
					setError("Report not found");
					setLoading(false);
					return;
				}

				const reportData =
					docSnapshot.data() as PerformanceReport;
				setReport(reportData);
				setLoading(false);
			} catch {
				setLoading(false);
				setError("Failed to fetch report data");
				return;
			}
		};
		fetchData();
	}, [id]);

	const { data: gameDetails } = useGameDetails(
		report?.IgdbGameId
	);

	if (error) {
		return (
			<Container>
				<Stack m="md">
					<Error errorMsg={error} />
				</Stack>
			</Container>
		);
	}

	if (loading) {
		return (
			<Container>
				<Stack m="md">
					<Text>Loading report...</Text>
				</Stack>
			</Container>
		);
	}

	return (
		<Container>
			<Stack m="md">
				<Breadcrumbs
					fw={600}
					separator="&#8250;"
					mb="md"
				>
					<Anchor
						onClick={(e) => {
							e.preventDefault();
							navigate("/");
						}}
						c="black"
						fw={500}
					>
						Home
					</Anchor>
					<Anchor
						onClick={(e) => {
							e.preventDefault();
							navigate(`/game/${report?.IgdbGameId}`);
						}}
						c="black"
						fw={500}
					>
						{report?.IgdbGameName}
					</Anchor>
				</Breadcrumbs>

				{gameDetails &&
					gameDetails[0]?.cover?.image_id &&
					loading === false && (
						<img
							src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${gameDetails[0].cover.image_id}.jpg`}
							alt={`The game cover for ${gameDetails[0]?.name}`}
							className="w-48 h-auto rounded-xs"
						/>
					)}

				<Stack my="md">
					{report?.perfRating && (
						<Paper
							w="fit-content"
							p="sm"
							bdrs="sm"
							withBorder={false}
							bg={getRatingColor(report.perfRating)}
						>
							<Group gap={10}>
								{getRatingIcon(report?.perfRating)}
								<Text>{report?.perfRating}/100</Text>
							</Group>
						</Paper>
					)}
				</Stack>

				<Table
					variant="vertical"
					layout="fixed"
					withTableBorder
				>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Metrics</Table.Th>
							<Table.Th>Value</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						<Table.Tr>
							<Table.Th>Average FPS</Table.Th>
							<Table.Td>
								{report?.metrics.averageFps}
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Th>Min FPS</Table.Th>
							<Table.Td>{report?.metrics.minFps}</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Th>Max FPS</Table.Th>
							<Table.Td>{report?.metrics.maxFps}</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>
				<Table
					variant="vertical"
					layout="fixed"
					withTableBorder
				>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Settings</Table.Th>
							<Table.Th>Value</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						<Table.Tr>
							<Table.Th>Upscaling</Table.Th>
							<Table.Td>
								{report?.settings.upscaling ? "Yes" : "No"}
							</Table.Td>
						</Table.Tr>
						{report?.settings.upscaling && (
							<>
								<Table.Tr>
									<Table.Th>Upscaling Method</Table.Th>
									<Table.Td>
										{report?.settings.upscalingMethod}
									</Table.Td>
								</Table.Tr>
								<Table.Tr>
									<Table.Th>Upscaling Quality</Table.Th>
									<Table.Td>
										{report?.settings.UpscalingQuality}
									</Table.Td>
								</Table.Tr>
							</>
						)}
						<Table.Tr>
							<Table.Th>Resolution</Table.Th>
							<Table.Td>
								{report?.settings.resolution}
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Th>Aspect Ratio</Table.Th>
							<Table.Td>
								{report?.settings.aspectRatio}
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Th>Graphics Preset</Table.Th>
							<Table.Td>
								{report?.settings.averageGraphicsPreset}
							</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>

				<Table
					variant="vertical"
					layout="fixed"
					withTableBorder
				>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Hardware</Table.Th>
							<Table.Th>Value</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						<Table.Tr>
							<Table.Th>CPU</Table.Th>
							<Table.Td>{report?.hardware.cpu}</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Th>GPU</Table.Th>
							<Table.Td>{report?.hardware.gpu}</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Th>RAM</Table.Th>
							<Table.Td>{report?.hardware.ram}</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Th>VRAM</Table.Th>
							<Table.Td>{report?.hardware.vram}</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Th>Storage Type</Table.Th>
							<Table.Td>
								{report?.hardware.storageType}
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Th>Hardware Type</Table.Th>
							<Table.Td>
								{report?.hardware.hardwareType}
							</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>

				{report?.createdAt && (
					<Badge
						fw={500}
						size="md"
					>
						Posted:{" "}
						{new Date(
							report?.createdAt.seconds * 1000
						).toLocaleDateString()}
					</Badge>
				)}
			</Stack>
		</Container>
	);
};

export default Report;
