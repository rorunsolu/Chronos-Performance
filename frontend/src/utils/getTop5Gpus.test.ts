import { type PerformanceReport } from "@/common/types";
import { getTop5Gpus } from "@/utils/getTop5Gpus";

interface report {
	IgdbGameId: string;
	perfRating: number;
}
