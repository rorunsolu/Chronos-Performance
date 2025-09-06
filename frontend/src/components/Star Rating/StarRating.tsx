import { Badge } from "@mantine/core";
import { Star, StarHalf } from "lucide-react";
interface StarRatingProps {
	rating: number;
	maxStars?: number;
}
const StarRating: React.FC<StarRatingProps> = ({
	rating,
	maxStars = 5,
}) => {
	const starRating = (rating / 100) * maxStars;

	const fullStars = Math.floor(starRating);
	const hasHalfStar = starRating % 1 >= 0.5;
	const emptyStars =
		maxStars - fullStars - (hasHalfStar ? 1 : 0);

	return (
		<Badge
			variant="transparent"
			color="black"
			radius="xl"
			className="absolute right-3 bottom-3"
			p="0"
		>
			<div className="flex items-center">
				{Array.from({ length: fullStars }, (_, index) => (
					<Star
						key={`full-${index}`}
						fill="yellow"
						strokeWidth={0}
						size={18}
					/>
				))}

				{hasHalfStar && (
					<StarHalf
						key="half"
						fill="yellow"
						strokeWidth={0}
						size={18}
					/>
				)}

				{Array.from({ length: emptyStars }, (_, index) => (
					<Star
						key={`empty-${index}`}
						fill="#111"
						strokeWidth={0}
						size={18}
					/>
				))}
			</div>
		</Badge>
	);
};

export default StarRating;
