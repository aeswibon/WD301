import logo from "../assets/logo.svg";

const Loading = () => {
	return (
		<div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-100 z-50">
			<img src={logo} className="w-16 h-16 animate-spin" alt="logo" />
		</div>
	);
};
export default Loading;
