import classes from "@/components/Card/StatCard.module.css";
import { Group, Paper, Text } from "@mantine/core";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const StatCard = ({
	title,
	about,
	avgPerfRating,
	diff,
}: {
	title: string;
	about: string;
	avgPerfRating: number | null;
	diff: number | null;
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
				mt={25}
			>
				<Text className={classes.value}>
					{avgPerfRating}
				</Text>
				<Text
					c={stat.diff > 0 ? "teal" : "red"}
					fz="sm"
					fw={500}
					className={classes.diff}
				>
					<span>{stat.diff}%</span>
					<DiffIcon
						size={16}
						strokeWidth={1.5}
					/>
				</Text>
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
