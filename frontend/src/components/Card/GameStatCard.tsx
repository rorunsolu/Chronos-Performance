import classes from "@/components/Card/GameStatCard.module.css";
import { Text } from "@mantine/core";

const data = [
	{
		title: "Average FPS",
	},
	{
		title: "New users",
	},
	{
		title: "Completed orders",
	},
];

const GameStatCard = ({
	averageFps,
}: {
	averageFps: number | null;
}) => {
	const stats = data.map((stat) => (
		<div
			key={stat.title}
			className={classes.stat}
		>
			<Text className={classes.count}>{averageFps}</Text>
			<Text className={classes.title}>{stat.title}</Text>
		</div>
	));

	return <div className={classes.root}>{stats}</div>;
};

export default GameStatCard;
