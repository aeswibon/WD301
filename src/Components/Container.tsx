import React from "react";
import Home from "./Home";

const Container = (props: { children: React.ReactNode }) => {
	return (
		<div className="flex min-h-screen bg-gray-100 items-center overflow-auto">
			<div className="m-auto w-1/3 p-8 mx-auto bg-white shadow-lg rounded-xl">
				<Home />
			</div>
		</div>
	);
};

export default Container;
