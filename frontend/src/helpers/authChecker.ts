import { auth } from "@/auth/Firebase";
import {
	onAuthStateChanged,
	type User,
} from "firebase/auth";

export const getAuthenticatedUser = (): Promise<User> => {
	return new Promise((resolve, reject) => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			unsubscribe();
			if (user) {
				resolve(user);
			} else {
				reject(new Error("User is not authenticated"));
			}
		});
	});
};
