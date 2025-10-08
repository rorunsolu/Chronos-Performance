import { auth } from "@/auth/Firebase";
import { db } from "@/auth/Firebase";
import { v4 as uuidv4 } from "uuid";
import {
	doc,
	getDoc,
	setDoc,
	arrayUnion,
	updateDoc,
	collection,
	getDocs,
	serverTimestamp,
	Timestamp,
	arrayRemove,
} from "firebase/firestore";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInAnonymously,
	signInWithPopup,
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	type User,
	type UserCredential,
} from "firebase/auth";

const AuthContext = createContext<
	AuthContextType | undefined
>(undefined);

export type userAccount = {
	userId: string;
	accUrlId: string;
	accEmail: string | null;
	accCreationDate: Timestamp;
	accName: string;
	accPhotoURL: string | null;
	favorites: number[];
	reports: string[];
};

export const AuthContextProvider: React.FC<
	AuthContextProviderProps
> = ({ children }: AuthContextProviderProps) => {
	const [user, setUser] = useState<User | null>(null);

	const [isGuest, setIsGuest] = useState(false);
	const [loading, setLoading] = useState(true);
	const [favorites, setFavorites] = useState<number[]>([]);
	const [allUsers, setAllUsers] = useState<userAccount[]>(
		[]
	);

	const addFavorite = async (
		gameId: number,
		userId: string
	) => {
		if (!user) {
			throw new Error("User (auth) doesn't exist");
		}

		try {
			const userRef = doc(db, "users", userId);
			const userDoc = await getDoc(userRef);
			const currentFavorites =
				userDoc.data()?.favorites || [];
			if (!currentFavorites.includes(gameId)) {
				await updateDoc(userRef, {
					favorites: arrayUnion(gameId),
				});
				setFavorites((prev) => [...prev, gameId]);
			} else {
				if (currentFavorites.includes(gameId)) {
					await updateDoc(userRef, {
						favorites: arrayRemove(gameId),
					});
					setFavorites((prev) =>
						prev.filter((fav) => fav !== gameId)
					);
				}
			}
		} catch {
			throw new Error("Failed to add favorite");
		}
	};

	const fetchUsers = async () => {
		try {
			const userCollection = collection(db, "users");
			const userSnapshot = await getDocs(userCollection);
			const allUserdata = userSnapshot.docs.map((doc) => ({
				...doc.data(),
			})) as userAccount[];

			setAllUsers(
				allUserdata.sort(
					(a, b) =>
						a.accCreationDate.toMillis() -
						b.accCreationDate.toMillis()
				)
			);
		} catch {
			throw new Error("Failed to fetch users");
		}
	};

	const fetchFavorites = async (userId: string) => {
		try {
			const userRef = doc(db, "users", userId);
			const userDoc = await getDoc(userRef);

			if (userDoc.exists()) {
				setFavorites(userDoc.data()?.favorites || []);
			} else if (!userDoc.exists()) {
				handleUserAccount(user!);
			}
		} catch (error) {
			throw new Error(
				`Failed to fetch favorites for user ${userId}: ${String(error)}`
			);
		}
	};

	const handleUserAccount = async (user: User) => {
		if (!user) {
			throw new Error("User (auth) doesn't exist");
		}
		const userRef = doc(db, "users", user.uid);
		const userDoc = await getDoc(userRef);

		if (!userDoc.exists()) {
			await setDoc(userRef, {
				userId: user.uid,
				accUrlId: uuidv4(),
				accEmail: user.email,
				accCreationDate: serverTimestamp(),
				accName: user.displayName || "Anonymous",
				accPhotoURL: user.photoURL || null,
				favorites: [],
				reports: [],
			});
		} else {
			await fetchFavorites(user.uid);
		}
	};

	const getUserFavorites = async (
		userId: string
	): Promise<number[]> => {
		try {
			const userRef = doc(db, "users", userId);
			const userDoc = await getDoc(userRef);
			return userDoc.exists()
				? userDoc.data()?.favorites || []
				: [];
		} catch (error) {
			throw new Error(
				`Failed to get favorites for user ${userId}: ${String(error)}`
			);
		}
	};

	const googleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		const credential = await signInWithPopup(
			auth,
			provider
		);
		await handleUserAccount(credential.user);
		return credential;
	};

	const emailSignIn = async (
		email: string,
		password: string
	) => {
		const credential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		await handleUserAccount(credential.user);
		return credential;
	};

	const emailSignUp = async (
		email: string,
		password: string
	) => {
		const credential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		await handleUserAccount(credential.user);
		return credential;
	};

	const signInAsGuest = async () => {
		const credential = await signInAnonymously(auth);
		setUser(credential.user);
		setIsGuest(true);
		await handleUserAccount(credential.user);
		return credential;
	};

	const logOut = () => {
		setUser(null);
		setIsGuest(false);

		return signOut(auth);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			auth,
			async (currentUser) => {
				setUser(currentUser);
				setIsGuest(currentUser?.isAnonymous || false);
				setLoading(false);

				if (currentUser) {
					await fetchFavorites(currentUser.uid);
				}

				console.log("Auth State Changed: ", currentUser);
			}
		);

		return () => {
			unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AuthContext.Provider
			value={{
				addFavorite,
				fetchFavorites,
				getUserFavorites,
				googleSignIn,
				signInAsGuest,
				emailSignIn,
				emailSignUp,
				logOut,
				user,
				isGuest,
				favorites,
				allUsers,
				fetchUsers,
			}}
		>
			{!loading && children}
		</AuthContext.Provider>
	);
};

export const UserAuth = (): AuthContextType => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error(
			"useAuth must be used within an AuthProvider"
		);
	}
	return context;
};

interface AuthContextType {
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
}

interface AuthContextProviderProps {
	children: ReactNode;
}
