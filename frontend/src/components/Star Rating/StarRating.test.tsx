import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StarRating from "@/components/Star Rating/StarRating";

describe("StarRating component", () => {
	it("renders the correct number of full and empty stars for a whole rating", () => {
		// 80% of 5 = 4 stars
		render(
			<StarRating
				rating={80}
				maxStars={5}
			/>
		);

		expect(screen.getAllByTestId("full-star")).toHaveLength(
			4
		);
		expect(
			screen.queryByTestId("half-star")
		).not.toBeInTheDocument();
		expect(
			screen.getAllByTestId("empty-star")
		).toHaveLength(1);
	});

	it("renders a half star when the rating includes a half value", () => {
		render(
			<StarRating
				rating={75}
				maxStars={5}
			/>
		);

		expect(screen.getAllByTestId("full-star")).toHaveLength(
			3
		);
		expect(
			screen.getByTestId("half-star")
		).toBeInTheDocument();
		expect(
			screen.getAllByTestId("empty-star")
		).toHaveLength(1);
	});

	it("renders all empty stars when rating is 0", () => {
		render(
			<StarRating
				rating={0}
				maxStars={5}
			/>
		);

		expect(
			screen.queryByTestId("full-star")
		).not.toBeInTheDocument();
		expect(
			screen.queryByTestId("half-star")
		).not.toBeInTheDocument();
		expect(
			screen.getAllByTestId("empty-star")
		).toHaveLength(5);
	});

	it("renders all full stars when rating is 100", () => {
		render(
			<StarRating
				rating={100}
				maxStars={5}
			/>
		);

		expect(screen.getAllByTestId("full-star")).toHaveLength(
			5
		);
		expect(
			screen.queryByTestId("half-star")
		).not.toBeInTheDocument();
		expect(
			screen.queryByTestId("empty-star")
		).not.toBeInTheDocument();
	});
});
