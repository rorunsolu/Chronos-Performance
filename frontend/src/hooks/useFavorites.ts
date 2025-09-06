import { UserAuth } from "@/auth/AuthContext";

export const isGameFavorited = (id: number) => {
	const { favorites } = UserAuth();
	return favorites.includes(id);
};
