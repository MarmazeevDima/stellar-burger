import { useDispatch, useSelector } from "@store";
import { ProfileUI } from "@ui-pages";
import { FC, SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, updateUser } from "../../services/slices/user";
import { TUser } from "@utils-types";

export const Profile: FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	/** TODO: взять переменную из стора */
	const { data: user } = useSelector((store) => store.userReducer);

	const [formValue, setFormValue] = useState({
		name: user.name,
		email: user.email,
		password: "",
	});

	useEffect(() => {
		setFormValue((prevState) => ({
			...prevState,
			name: user?.name || "",
			email: user?.email || "",
		}));
	}, [user]);

	const isFormChanged =
		formValue.name !== user?.name ||
		formValue.email !== user?.email ||
		!!formValue.password;

	const handleSubmit = (e: SyntheticEvent) => {
		e.preventDefault();
		if (!!formValue.password) {
			dispatch(updateUser(formValue));
			dispatch(logout())
				.unwrap()
				.then(() => {
					navigate("/login");
				})
				.catch((error) => {
					console.error("Ошибка при выходе:", error);
				});
		} else {
			dispatch(updateUser(formValue))
				.unwrap()
				.then((user: TUser) => {
					setFormValue({
						name: user.name,
						email: user.email,
						password: "",
					});
				});
		}
	};

	const handleCancel = (e: SyntheticEvent) => {
		e.preventDefault();
		setFormValue({
			name: user.name,
			email: user.email,
			password: "",
		});
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormValue((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<ProfileUI
			formValue={formValue}
			isFormChanged={isFormChanged}
			handleCancel={handleCancel}
			handleSubmit={handleSubmit}
			handleInputChange={handleInputChange}
		/>
	);
};