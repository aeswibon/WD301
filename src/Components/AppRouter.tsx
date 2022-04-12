import React from "react";
import { useRoutes } from "raviger";
import { User } from "../types/form";
import Loading from "./Loading";
import { me } from "../utils/apiUtil";
const Home = React.lazy(() => import("./Home"));
const Form = React.lazy(() => import("./Form"));
const ListForms = React.lazy(() => import("./ListForms"));
const Login = React.lazy(() => import("./Login"));
const Preview = React.lazy(() => import("./Preview"));
const PreviewForm = React.lazy(() => import("./PreviewForm"));

const routes = {
	"/": () => (
		<React.Suspense fallback={<Loading />}>
			<ListForms />
		</React.Suspense>
	),
	"/login": () => (
		<React.Suspense fallback={<Loading />}>
			<Login />
		</React.Suspense>
	),
	"/forms/:formId": ({ formId }: { formId: string }) => (
		<React.Suspense fallback={<Loading />}>
			<Form formId={Number(formId)} />
		</React.Suspense>
	),
	"/preview/:formId": ({ formId }: { formId: string }) => (
		<React.Suspense fallback={<Loading />}>
			<PreviewForm formId={Number(formId)} />
		</React.Suspense>
	),
	"/preview/:formId/submission": ({ formId }: { formId: string }) => (
		<React.Suspense fallback={<Loading />}>
			<Preview formId={Number(formId)} />
		</React.Suspense>
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
