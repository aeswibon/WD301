import logo from "../assets/logo.svg";
const Home = (): JSX.Element => {
	return (
		<div className="flex gap-2 items-center ">
			<img className="h-16 w-16 animate-spin-slow" src={logo} alt="logo" />
			<h1 className="text-center text-xl">
				Welcome to Lesson 5 $react-typescript with #tailwindcss
			</h1>
		</div>
	);
};

export default Home;
