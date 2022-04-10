import logo from "../assets/logo.svg";
import { ActiveLink } from "raviger";
import { User } from "../types/form";

const Home = (props: { user: User }): JSX.Element => {
	return (
		<>
			<div className="flex gap-2 justify-between items-center ">
				<img
					className="h-16 w-16 animate-spin"
					style={{ animation: "spin 3s linear infinite" }}
					src={logo}
					alt="logo"
				/>
				<div className="flex gap-3">
					{[
						{ page: "Home", url: "/" },
						...(props.user?.username?.length > 0
							? [
									{
										page: "Logout",
										onClick: () => {
											localStorage.removeItem("token");
											window.location.href = "/login";
										},
									},
							  ]
							: [{ page: "Login", url: "/login" }]),
					].map((link) =>
						link.url ? (
							<ActiveLink
								key={link.url}
								href={link.url}
								className="text-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
								exactActiveClass="text-blue-600 border-b-2 bg-white border-blue-700">
								{link.page}
							</ActiveLink>
						) : (
							<button
								type="button"
								key={link.page}
								onClick={link.onClick}
								className="text-white bg-blue-600 p-2 m-2 uppercase font-semibold">
								{link.page}
							</button>
						),
					)}
				</div>
			</div>
		</>
	);
};

export default Home;
