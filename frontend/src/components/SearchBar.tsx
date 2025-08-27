import { JsonInput, TextInput } from "@mantine/core";
import { useState } from "react";

const SearchBar = () => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState("");

	const searchGames = async (searchQuery: string) => {
		try {
			const response = await fetch(
				`/api/IGDBapi/results/search?q=${encodeURIComponent(searchQuery)}`
			);
			if (!response.ok) {
				throw new Error(`Error searching games: ${response.status}`);
			}
			const data = await response.json();
			setResults(data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<TextInput
				placeholder="Search games"
				value={query}
				onChange={(e) => {
					setQuery(e.currentTarget.value);
					searchGames(e.currentTarget.value);
				}}
			/>

			<JsonInput
				value={JSON.stringify(results, null, 2)}
				readOnly
				minRows={8}
				autosize
			/>
		</>
	);
};

export default SearchBar;
