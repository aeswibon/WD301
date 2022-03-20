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
		<div className="flex h-screen p-4 items-center bg-gray-100 overflow-auto">
			<div className="flex flex-col max-w-6xl p-8 mx-auto bg-white shadow-lg rounded-xl">
				<Home />
				{routeResult}
			</div>
		</div>
	);
};

export default AppRouter;
