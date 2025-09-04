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

export type GPUOptions =
	| "GTX 1050"
	| "GTX 1050 Ti"
	| "GTX 1060"
	| "GTX 1070"
	| "GTX 1070 Ti"
	| "GTX 1080"
	| "GTX 1080 Ti"
	| "RX 550"
	| "RX 560"
	| "RX 570"
	| "RX 580"
	| "RX 590"
	| "Titan Xp"
	| "Titan V"
	| "GTX 1650"
	| "GTX 1660"
	| "GTX 1660 Ti"
	| "GTX 1650 Super"
	| "GTX 1660 Super"
	| "RX 5500 XT"
	| "RX 5600 XT"
	| "RX 5700"
	| "RX 5700 XT"
	| "RTX 2050"
	| "RTX 2060"
	| "RTX 2060 Super"
	| "RTX 2070"
	| "RTX 2070 Super"
	| "RTX 2080"
	| "RTX 2080 Super"
	| "RTX 2080 Ti"
	| "Titan RTX"
	| "Quadro RTX 4000"
	| "Quadro RTX 5000"
	| "Quadro RTX 6000"
	| "Quadro RTX 8000"
	| "RX 6500 XT"
	| "RX 6600"
	| "RX 6600 XT"
	| "RX 6650 XT"
	| "RX 6700 XT"
	| "RX 6750 XT"
	| "RX 6800"
	| "RX 6800 XT"
	| "RX 6900 XT"
	| "RX 6950 XT"
	| "RTX 3050"
	| "RTX 3060"
	| "RTX 3060 Ti"
	| "RTX 3070"
	| "RTX 3070 Ti"
	| "RTX 3080"
	| "RTX 3080 Ti"
	| "RTX 3090"
	| "RTX 3090 Ti"
	| "Arc A380"
	| "Arc A750"
	| "Arc A770"
	| "RX 7600"
	| "RX 7700 XT"
	| "RX 7800 XT"
	| "RX 7900 XT"
	| "RX 7900 XTX"
	| "RTX 4070"
	| "RTX 4070 Ti"
	| "RTX 4080"
	| "RTX 4090"
	| "RTX 5060"
	| "RTX 5070"
	| "RTX 5070 Ti"
	| "RTX 5080"
	| "RTX 5090"
	| "RX 9060"
	| "RX 9060 XT"
	| "RX 9070"
	| "RX 9070 XT";

export type CPUOptions =
	| "Core i3-9100"
	| "Core i5-9400"
	| "Core i7-9700"
	| "Core i9-9900"
	| "Core i3-10100"
	| "Core i5-10400"
	| "Core i7-10700"
	| "Core i9-10900"
	| "Ryzen 3 3100"
	| "Ryzen 3 3300X"
	| "Ryzen 5 3500"
	| "Ryzen 5 3600"
	| "Ryzen 5 3600X"
	| "Ryzen 7 3700X"
	| "Ryzen 7 3800X"
	| "Ryzen 9 3900X"
	| "Ryzen 9 3950X"
	| "Core i5-11400"
	| "Core i5-11600"
	| "Core i7-11700"
	| "Core i9-11900"
	| "Ryzen 3 5300G"
	| "Ryzen 5 5500"
	| "Ryzen 5 5600"
	| "Ryzen 5 5600X"
	| "Ryzen 5 5600G"
	| "Ryzen 7 5700G"
	| "Ryzen 7 5700X"
	| "Ryzen 7 5800"
	| "Ryzen 7 5800X"
	| "Ryzen 7 5800X3D"
	| "Ryzen 9 5900"
	| "Ryzen 9 5900X"
	| "Ryzen 9 5950X"
	| "Core i3-12100"
	| "Core i5-12400"
	| "Core i5-12600"
	| "Core i7-12700"
	| "Core i9-12900"
	| "Ryzen 5 6600H"
	| "Ryzen 7 6800H"
	| "Ryzen 9 6900HX"
	| "Core i3-13100"
	| "Core i5-13400"
	| "Core i5-13600"
	| "Core i7-13700"
	| "Core i9-13900"
	| "Ryzen 5 7500F"
	| "Ryzen 5 7600"
	| "Ryzen 5 7600X"
	| "Ryzen 7 7700"
	| "Ryzen 7 7700X"
	| "Ryzen 7 7800X3D"
	| "Ryzen 9 7900"
	| "Ryzen 9 7900X"
	| "Ryzen 9 7950X"
	| "Ryzen 9 7950X3D"
	| "Core i5-14400"
	| "Core i5-14600"
	| "Core i7-14700"
	| "Core i9-14900"
	| "Ryzen 5 8500G"
	| "Ryzen 5 8600G"
	| "Ryzen 7 8700G"
	| "Core i5-15500"
	| "Core i5-15600"
	| "Core i7-15700"
	| "Core i9-15900"
	| "Ryzen 5 9500"
	| "Ryzen 5 9600"
	| "Ryzen 5 9600X"
	| "Ryzen 7 9700"
	| "Ryzen 7 9700X"
	| "Ryzen 7 9800X3D"
	| "Ryzen 9 9900"
	| "Ryzen 9 9900X"
	| "Ryzen 9 9950X";

export type UpscalingMethod =
	| "Native"
	| "FSR"
	| "DLSS"
	| "XeSS";
export type UpscalingQuality =
	| "Native"
	| "DLAA"
	| "Quality"
	| "Balanced"
	| "Performance"
	| "Ultra Performance";
export type AspectRatio = "16:9" | "21:9" | "32:9";
export type Resolution = "720p" | "1080p" | "1440p" | "4K";
export type AverageGraphicsPreset =
	| "Low"
	| "Medium"
	| "High"
	| "Ultra";
export type RAMOptions =
	| "4GB"
	| "8GB"
	| "16GB"
	| "32GB"
	| "64GB"
	| "128GB";
export type VRAMOptions =
	| "2GB"
	| "4GB"
	| "6GB"
	| "8GB"
	| "10GB"
	| "12GB"
	| "16GB"
	| "24GB"
	| "32GB";
export type StorageType = "HDD" | "SSD";
export type HardwareType = "Laptop" | "Desktop";

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
		const user = getAuthenticatedUser();

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
