import { useRoutes } from "raviger";
import { User } from "../types/form";
import Form from "./Form";
import Home from "./Home";
import ListForms from "./ListForms";
import Login from "./Login";
import Preview from "./Preview";
import PreviewForm from "./PreviewForm";

const routes = {
	"/": () => <ListForms />,
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

const AppRouter = (props: { user: User }) => {
	const routeResult = useRoutes(routes);
	return (
		<div className="flex min-h-screen bg-gray-100 items-center overflow-auto">
			<div className="m-auto w-1/2 xl:w-1/3 p-8 mx-auto bg-white shadow-lg rounded-xl">
				<Home user={props.user} />
				{routeResult}
			</div>
		</div>
	);
};

export default AppRouter;
