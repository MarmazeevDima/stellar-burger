import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ProfileMenuUI } from "@ui";
import { useDispatch } from "@store";
import { logout } from "../../services/slices/user";

export const ProfileMenu: FC = () => {
	const { pathname } = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logout())
			.unwrap()
			.then(() => {
				navigate("/login");
			})
			.catch((error) => {
				console.error("Ошибка при выходе:", error);
			});
	};

	return (
		<ProfileMenuUI
			handleLogout={handleLogout}
			pathname={pathname}
		/>
	);
};