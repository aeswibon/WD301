import React from "react";
import AppRouter from "./Components/AppRouter";
import { User } from "./types/form";
import { me } from "./utils/apiUtil";

const App = () => {
	const [user, setUser] = React.useState<User>({
		username: "",
	});
	React.useEffect(() => {
		const getCurrentUser = async () => {
			const user: User = await me();
			setUser(user);
		};
		getCurrentUser();
	}, []);
	return (
		<React.Fragment>
			<AppRouter user={user} />
		</React.Fragment>
	);
};

export default App;
