import { db } from "@/auth/Firebase";
import { getAuthenticatedUser } from "@/helpers/authChecker";
import { PerformanceReportContext } from "@/hooks/usePerformanceReportHook";
import { useState } from "react";
import type { ReactNode } from "react";
import {
	Timestamp,
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	updateDoc,
	arrayUnion,
	arrayRemove,
} from "firebase/firestore";

import type { PerformanceReport } from "@/common/types";

export const PerformanceReportProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [reports, setReports] = useState<
		PerformanceReport[]
	>([]);

	const fetchReports = async () => {
		const reportsCollection = collection(db, "reports");
		const reportsSnapshot = await getDocs(
			reportsCollection
		);
		const reportsData = reportsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as PerformanceReport[];

		setReports(
			reportsData.sort(
				(a, b) =>
					b.createdAt.toMillis() - a.createdAt.toMillis()
			)
		);
		console.log("Reports fetched");
	};

	const createReport = async (
		report: Omit<PerformanceReport, "id">
	) => {
		const user = await getAuthenticatedUser();

		try {
			const data = {
				...report,
				userId: user.uid,
				createdAt: Timestamp.now(),
			};

			const docRef = await addDoc(
				collection(db, "reports"),
				data
			);

			const userRef = doc(db, "users", user.uid);
			await updateDoc(userRef, {
				reports: arrayUnion(docRef.id),
			});

			setReports((prev) => [
				...prev,
				{
					id: docRef.id,
					...data,
				},
			]);
			console.log("Report created:", docRef.id);
			return docRef.id;
		} catch (error) {
			throw new Error(`Error creating report: ${error}`);
		}
	};

	const deleteReport = async (id: string) => {
		try {
			const user = await getAuthenticatedUser();
			await deleteDoc(doc(db, "reports", id));
			const userRef = doc(db, "users", user.uid);
			await updateDoc(userRef, {
				reports: arrayRemove(id),
			});
			setReports((prev) =>
				prev.filter((report) => report.id !== id)
			);
			console.log("Report deleted:", id);
		} catch (error) {
			throw new Error(`Error deleting report: ${error}`);
		}
	};

	return (
		<PerformanceReportContext.Provider
			value={{
				reports,
				fetchReports,
				deleteReport,
				createReport,
			}}
		>
			{children}
		</PerformanceReportContext.Provider>
	);
};

export type PerformanceReportContextType = {
	reports: PerformanceReport[];
	fetchReports: () => Promise<void>;
	deleteReport: (id: string) => Promise<void>;
	createReport: (
		report: Omit<PerformanceReport, "id">
	) => Promise<string>;
};
