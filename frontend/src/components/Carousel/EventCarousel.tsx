import classes from "@/components/Carousel/Event.module.css";
import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import {
	Text,
	Paper,
	Title,
	useMantineTheme,
	Badge,
} from "@mantine/core";

interface Event {
	id: number;
	name: string;
	description: string;
	start_time: number;
	end_time: number;
	url: string;
	event_logo: {
		image_id: string;
	} | null;
	live_stream_url: string | null;
	event_networks: {
		url: string;
	}[];
}

const EventCarousel = () => {
	const theme = useMantineTheme();
	const mobile = useMediaQuery(
		`(max-width: ${theme.breakpoints.sm})`
	);

	const eventQuery = useQuery({
		queryKey: ["events"],
		queryFn: async () => {
			const baseUrl =
				import.meta.env.VITE_PROD_BACKEND_URL ||
				import.meta.env.VITE_LOCAL_BACKEND_URL;
			const res = await fetch(
				`${baseUrl}/api/IGDBapi/events`
			);
			const eventData = await res.json();
			return eventData;
		},
	});

	const Card = ({ event }: { event: Event }) => {
		const formattedDate = new Date(
			event.start_time * 1000
		).toLocaleDateString("en-GB");

		return (
			<Paper
				bdrs={0}
				withBorder={false}
				style={{
					backgroundImage: event.event_logo?.image_id
						? `url(https://images.igdb.com/igdb/image/upload/t_cover_big/${event.event_logo.image_id}.jpg)`
						: "https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png",
				}}
				className={classes.card}
				onClick={() => {
					if (
						Array.isArray(event.event_networks) &&
						event.event_networks.length > 0 &&
						event.event_networks[0]?.url
					) {
						window.open(
							event.event_networks[0]?.url,
							"_blank"
						);
					}
				}}
			>
				<div>
					<Badge
						ml={-10}
						className={classes.category}
						fw={600}
						variant="transparent"
						c="white"
					>
						{formattedDate}
					</Badge>
					<Title
						order={3}
						className={classes.title}
					>
						{event.name}
					</Title>
				</div>
			</Paper>
		);
	};

	return (
		<Carousel
			bdrs="md"
			slideSize={{
				base: "100%",
				xs: "50%",
				sm: "50%",
				md: "33.3333333%",
			}}
			slideGap="0"
			emblaOptions={{
				align: "start",
				slidesToScroll: mobile ? 1 : 2,
			}}
		>
			{eventQuery.data && eventQuery.data.length > 0 ? (
				eventQuery.data?.map((event: Event) => (
					<Carousel.Slide key={event.id}>
						<Card event={event} />
					</Carousel.Slide>
				))
			) : (
				<Text>No events available</Text>
			)}
		</Carousel>
	);
};

export default EventCarousel;
