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
} from "firebase/firestore";

import type {
	GPUOptions,
	VRAMOptions,
	RAMOptions,
	CPUOptions,
	StorageType,
	HardwareType,
	AspectRatio,
	Resolution,
	AverageGraphicsPreset,
	UpscalingMethod,
	UpscalingQuality,
} from "@/common/types";

export type PerformanceReport = {
	IgdbGameId: string; // derived from the IGDB API
	IgdbGameName: string; // derived from the IGDB API
	reportId: string;
	userId: string;
	createdAt: Timestamp;

	metrics: {
		averageFps: number;
		minFps?: number;
		maxFps?: number;
	};

	settings: {
		upscaling: boolean; // for easy filtering
		upscalingMethod?: UpscalingMethod;
		UpscalingQuality?: UpscalingQuality;

		aspectRatio: AspectRatio;
		resolution: Resolution;
		averageGraphicsPreset: AverageGraphicsPreset;
	};

	hardware: {
		cpu: CPUOptions;
		gpu: GPUOptions;
		ram: RAMOptions;
		vram: VRAMOptions;
		storageType: StorageType;
		hardwareType: HardwareType;
	};
};

export type PerformanceReportContextType = {
	reports: PerformanceReport[];
	fetchReports: () => Promise<void>;
	deleteReport: (reportId: string) => Promise<void>;
	createReport: (
		report: PerformanceReport
	) => Promise<string>;
};

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
			...doc.data(),
		})) as PerformanceReport[];

		setReports(
			reportsData.sort(
				(a, b) =>
					b.createdAt.toMillis() - a.createdAt.toMillis()
			)
		);
	};

	const createReport = async (
		report: PerformanceReport
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

			setReports((prev) => [
				...prev,
				{
					...data,
				},
			]);
			return docRef.id;
		} catch (error) {
			throw new Error(`Error creating report: ${error}`);
		}
	};

	const deleteReport = async (reportId: string) => {
		try {
			const reportDoc = doc(db, "reports", reportId);

			await deleteDoc(reportDoc);
			setReports((prev) =>
				prev.filter(
					(report) => report.reportId !== reportId
				)
			);
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
