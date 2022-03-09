import React from "react";
import ListForms from "./Components/ListForms";
import Home from "./Components/Home";
import Form from "./Components/Form";

const App = () => {
	const [toggle, setToggle] = React.useState<string>("listForms");
	return (
		<div className="flex min-h-screen bg-gray-100 items-center overflow-auto">
			<div className="m-auto w-1/3 p-8 mx-auto bg-white shadow-lg rounded-xl">
				<Home />
				{toggle === "listForms" ? (
					<ListForms setState={setToggle} />
				) : (
					<Form state={toggle} setState={setToggle} />
				)}
			</div>
		</div>
	);
};

export default App;
