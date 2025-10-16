import classes from "@/pages/Error/Error.module.css";
import image from "/404PageImage.svg";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Container,
	Image,
	SimpleGrid,
	Text,
	Title,
} from "@mantine/core";

const Error = ({ errorMsg }: { errorMsg: string }) => {
	const navigate = useNavigate();

	return (
		<Container className={classes.root}>
			<SimpleGrid
				spacing={{ base: 40, sm: 80 }}
				cols={{ base: 1, sm: 2 }}
			>
				<Image
					src={image}
					className={classes.mobileImage}
				/>
				<div>
					<Title className={classes.title}>
						Something is not right...
					</Title>
					<Text
						c="dimmed"
						size="lg"
					>
						{errorMsg}
					</Text>
					<Button
						variant="outline"
						size="md"
						mt="md"
						className={classes.control}
						onClick={() => navigate("/")}
					>
						Go back to home page
					</Button>
				</div>
			</SimpleGrid>
		</Container>
	);
};

export default Error;
