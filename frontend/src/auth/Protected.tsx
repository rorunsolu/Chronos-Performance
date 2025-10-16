import { UserAuth } from "@/hooks/UserAuthHook";
import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";

const Protected = ({
	children,
	allowGuest = false,
}: ProtectedProps) => {
	const { user } = UserAuth();

	const hasAccess =
		user && (allowGuest || !user.isAnonymous);

	if (!hasAccess) {
		return <Navigate to="/" />;
	}

	return children;
};

export default Protected;

interface ProtectedProps {
	children: ReactNode;
	allowGuest?: boolean;
}
