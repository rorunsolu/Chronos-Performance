import { createContext, useContext } from "react";
import { type userAccount } from "@/common/types";
import {
	type UserCredential,
	type User,
} from "firebase/auth";

export const AuthContext = createContext<
	AuthContextType | undefined
>(undefined);

export const UserAuth = (): AuthContextType => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error(
			"UserAuth must be used within an AuthContextProvider"
		);
	}
	return context;
};

export type AuthContextType = {
	isGuest: boolean;
	user: User | null;
	favorites: number[];
	allUsers: userAccount[];
	logOut: () => void;
	fetchUsers: () => Promise<void>;
	googleSignIn: () => Promise<UserCredential>;
	signInAsGuest: () => Promise<UserCredential>;
	fetchFavorites: (userId: string) => Promise<void>;
	getUserFavorites: (userId: string) => Promise<number[]>;
	addFavorite: (
		gameId: number,
		userId: string
	) => Promise<void>;
	emailSignIn: (
		email: string,
		password: string
	) => Promise<UserCredential>;
	emailSignUp: (
		email: string,
		password: string
	) => Promise<UserCredential>;
};
