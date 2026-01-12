import styles from "@/components/Card/GameCard.module.css";
import { UserAuth } from "@/hooks/UserAuthHook";
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
	game_id: number;
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
	isOnPopularPage,
}: {
	game: HomePageGame;
	handleFavourite: (gameId: number) => Promise<void>;
	isOnPopularPage: boolean;
}) => {
	const navigate = useNavigate();
	const { favorites, user } = UserAuth();
	const isFavorited =
		favorites.filter(
			(fav) => fav === game.id || fav === game.game_id
		).length > 0;

	return (
		<Card
			key={game.id}
			onClick={() =>
				navigate(
					`/game/${isOnPopularPage ? game.game_id : game.id}`
				)
			}
			p={0}
			className={` ${isOnPopularPage ? styles.card : styles.cardHome}`}
			withBorder={false}
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
					className={styles.image}
				/>
				<Button
					variant="light"
					className={styles.favourite}
					color={isFavorited ? "black" : "black"}
					bdrs="100"
					p="0"
					bd="80"
					bg={
						isFavorited
							? "transparent"
							: "rgba(0, 0, 0, 0.4)"
					}
					onClick={(e) => {
						e.stopPropagation();
						handleFavourite(
							isOnPopularPage ? game.game_id : game.id
						);
					}}
					autoContrast
					hidden={!user}
				>
					<Heart
						fill={isFavorited ? "red" : "none"}
						stroke={isFavorited ? "red" : "white"}
						size={20}
					/>
				</Button>
				{game.rating && <StarRating rating={game.rating} />}
			</Card.Section>
			<Group
				justify="space-between"
				p="sm"
				display={"none"}
			>
				<Text
					fw={500}
					size="sm"
					truncate="end"
				>
					{game.name}
				</Text>
			</Group>
		</Card>
	);
};

export default GameCard;
