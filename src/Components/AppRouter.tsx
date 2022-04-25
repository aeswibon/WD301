import React from "react";
import { useRoutes } from "raviger";
import { User } from "../types/form";
import Loading from "./Loading";
import { me } from "../utils/apiUtil";
import Login from "./Login";
import Form from "./Form";
import PreviewForm from "./PreviewForm";
import Preview from "./Preview";
const Home = React.lazy(() => import("./Home"));
const ListForms = React.lazy(() => import("./ListForms"));

const routes = {
	"/": () => (
		<React.Suspense fallback={<Loading />}>
			<ListForms />
		</React.Suspense>
	),
	"/login": () => <Login />,
	"/forms/:formId": ({ formId }: { formId: string }) => (
		<Form formId={Number(formId)} />
	),
	"/preview/:formId": ({ formId }: { formId: string }) => (
		<PreviewForm formId={Number(formId)} />
	),
	"/preview/:formId/submission": ({ formId }: { formId: string }) => (
		<Preview formId={Number(formId)} />
	),
};

const AppRouter = () => {
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
	const routeResult = useRoutes(routes);
	return (
		<div className="flex min-h-screen bg-gray-100 items-center overflow-auto">
			<div className="m-auto w-1/2 xl:w-1/3 p-8 mx-auto bg-white shadow-lg rounded-xl">
				<React.Suspense fallback={<Loading />}>
					<Home user={user} />
				</React.Suspense>
				{routeResult}
			</div>
		</div>
	);
};

export default AppRouter;
