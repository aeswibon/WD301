import { useRoutes } from "raviger";
import Form from "./Form";
import Home from "./Home";
import ListForms from "./ListForms";
import PreviewForm from "./Preview";

const routes = {
	"/": () => <ListForms />,
	"/form/:formId": ({ formId }: { formId: string }) => <Form formId={formId} />,
	"/preview/:formId": ({ formId }: { formId: string }) => (
		<PreviewForm formId={formId} />
	),
};

const AppRouter = () => {
	const routeResult = useRoutes(routes);
	return (
		<div className="flex min-h-screen bg-gray-100 items-center overflow-auto">
			<div className="m-auto w-1/2 xl:w-1/3 p-8 mx-auto bg-white shadow-lg rounded-xl">
				<Home />
				{routeResult}
			</div>
		</div>
	);
};

export default AppRouter;
