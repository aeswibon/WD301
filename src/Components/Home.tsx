import logo from "../assets/logo.svg";
import { Link } from "raviger";

const Home = (): JSX.Element => {
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
					<Link
						className="text-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
						href="/">
						Home
					</Link>
				</div>
			</div>
		</>
	);
};

export default Home;
