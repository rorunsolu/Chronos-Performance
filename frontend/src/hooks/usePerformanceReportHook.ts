import { createContext, useContext } from "react";
import { type PerformanceReportContextType } from "@/contexts/PerformanceReportContext";

export const PerformanceReportContext = createContext<
	PerformanceReportContextType | undefined
>(undefined);

export const usePerformanceReportHook = () => {
	const context = useContext(PerformanceReportContext);
	if (context === undefined) {
		throw new Error(
			"usePerformanceReport must be used within a PerformanceReportProvider"
		);
	}
	return context;
};
