import React from "react";
import Form from "./Components/Form";
import Home from "./Components/Home";

const App = () => {
	const [toggle, setToggle] = React.useState<boolean>(true);
	const handleClick = () => {
		setToggle(!toggle);
	};
	return (
		<div className="flex min-h-screen bg-gray-100 items-center overflow-auto">
			<div className="m-auto w-1/3 p-8 mx-auto bg-white shadow-lg rounded-xl">
				{toggle ? <Home /> : <Form />}
				<button
					type="submit"
					onClick={handleClick}
					className="p-4 mt-4 bg-blue-600 rounded-lg w-full text-white font-bold">
					{toggle ? `Open` : `Close`} Form
				</button>
			</div>
		</div>
	);
};

export default App;
