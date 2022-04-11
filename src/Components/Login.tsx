import React from "react";
import { navigate } from "raviger";
import { login } from "../utils/apiUtil";

const Login = () => {
	const [username, setUsername] = React.useState<string>("");
	const [password, setPassword] = React.useState<string>("");

	React.useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			navigate("/");
		}
	}, []);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const data = await login(username, password);
			localStorage.setItem("token", data.token);
			navigate("/");
			window.location.reload();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="min-h-full w-full flex items-center justify-center py-6 px-4">
			<div className="max-w-md w-full">
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm">
						<div className="my-4">
							<label htmlFor="username" className="mb-1">
								Username
							</label>
							<input
								required
								type="text"
								id="username"
								name="username"
								value={username}
								placeholder="Username"
								autoComplete="username"
								onChange={(e) => setUsername(e.target.value)}
								className="border-2 border-gray-200 bg-gray-200 rounded-lg p-2 my-2 w-full outline-none hover:outline-blue-800"
							/>
						</div>
						<div className="my-4">
							<label htmlFor="password" className="mb-1">
								Password
							</label>
							<input
								required
								id="password"
								name="password"
								type="password"
								value={password}
								placeholder="Password"
								autoComplete="current-password"
								onChange={(e) => setPassword(e.target.value)}
								className="border-2 border-gray-200 bg-gray-200 rounded-lg p-2 my-2 w-full outline-none hover:outline-blue-800"
							/>
						</div>
					</div>
					<div className="my-4">
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-[16px] font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							Sign in
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default Login;
