import styles from "@/components/Card/GameCard.module.css";
import { isGameFavorited } from "@/hooks/useFavorites";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarRating from "@/components/Star Rating/StarRating";
import {
	Card,
	Group,
	Image,
	Text,
	Button,
} from "@mantine/core";

interface HomePageGame {
	id: number;
	name: string;
	cover: {
		image_id: string;
	};
	rating: number;
	url: string;
	genres: {
		name: string;
	}[];
}

const GameCard = ({
	game,
	handleFavourite,
}: {
	game: HomePageGame;
	handleFavourite: (gameId: number) => Promise<void>;
}) => {
	const navigate = useNavigate();

	return (
		<Card
			shadow="sm"
			padding="xs"
			radius="md"
			withBorder
			key={game.id}
			onClick={() => navigate(`/game/${game.id}`)}
			className={styles.card}
		>
			<Card.Section className="relative">
				<Image
					src={
						game.cover
							? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
							: "https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png"
					}
					alt={`Image of ${game.name}`}
					fallbackSrc="https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png"
				/>
				<Button
					variant="light"
					className={styles.favourite}
					color="black"
					bdrs="100"
					p="0"
					bd="80"
					onClick={(e) => {
						e.stopPropagation();
						handleFavourite(game.id);
					}}
					autoContrast
				>
					<Heart
						fill={isGameFavorited(game.id) ? "red" : "none"}
						stroke="white"
						size={20}
					/>
				</Button>
				{game.rating && <StarRating rating={game.rating} />}
			</Card.Section>
			<Group
				justify="space-between"
				mt="sm"
			>
				<Text
					fw={500}
					truncate="end"
				>
					{game.name}
				</Text>
			</Group>
		</Card>
	);
};

export default GameCard;
