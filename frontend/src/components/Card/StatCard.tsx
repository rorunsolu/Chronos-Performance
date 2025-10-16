import classes from "@/components/Card/StatCard.module.css";
import { Group, Paper, Text } from "@mantine/core";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const StatCard = ({
	title,
	about,
	avgPerfRating,
	avgRandomGpuFps,
	diff,
}: {
	title: string;
	about: string;
	avgPerfRating?: number | null;
	avgRandomGpuFps?: number | null;
	diff?: number | null;
}) => {
	const stat = {
		title,
		about,
		avgPerfRating,
		diff: diff ?? 0,
	};

	const DiffIcon =
		stat.diff > 0 ? ArrowUpRight : ArrowDownRight;

	return (
		<Paper
			withBorder
			p="md"
			radius="md"
		>
			<Group justify="space-between">
				<Text
					size="xs"
					c="dimmed"
					className={classes.title}
				>
					{title}
				</Text>
			</Group>

			<Group
				align="flex-end"
				gap="xs"
				mt="xs"
			>
				{avgPerfRating && (
					<Text className={classes.value}>
						{avgPerfRating}
					</Text>
				)}

				{avgRandomGpuFps && (
					<Text className={classes.value}>
						{avgRandomGpuFps} fps
					</Text>
				)}

				{stat.diff !== null && stat.diff !== undefined && (
					<Text
						c={stat.diff > 0 ? "teal" : "red"}
						fz="sm"
						fw={500}
						className={classes.diff}
						mb={2}
					>
						<span>{stat.diff}%</span>
						<DiffIcon
							className="mt-0.5"
							size={16}
							strokeWidth={2}
						/>
					</Text>
				)}
			</Group>

			<Text
				fz="xs"
				c="dimmed"
				mt={7}
			>
				{about}
			</Text>
		</Paper>
	);
};

export default StatCard;
