import { Star, StarHalf } from "lucide-react";
interface StarRatingProps {
	rating: number;
	maxStars?: number;
}
const StarRating: React.FC<StarRatingProps> = ({
	rating,
	maxStars = 5,
}: StarRatingProps) => {
	const starRating = (rating / 100) * maxStars;

	const fullStars = Math.floor(starRating);
	const hasHalfStar = starRating % 1 >= 0.5;
	const emptyStars =
		maxStars - fullStars - (hasHalfStar ? 1 : 0);

	return (
		<div className="flex items-center absolute right-[30px] bottom-[15px] z-20">
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
	);
};

export default StarRating;
