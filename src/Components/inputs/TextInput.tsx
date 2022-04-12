import { fieldChecker } from "../../types/form";

interface TextInputProps {
	field: fieldChecker;
	error: string;
	answer: string;
	changeValueCB: (id: number, value: string) => void;
}

const TextInput = (props: TextInputProps) => {
	const { field, error, answer, changeValueCB } = props;

	return (
		<div className="flex flex-col">
			<div>
				<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
					{field.label}
				</label>
				<input
					type="text"
					className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
					value={answer}
					name={field.label}
					onChange={(e) => changeValueCB(field.id!, e.target.value)}
					placeholder={field.label}
				/>
			</div>
			{error && <span className="text-sm text-red-600">{error}</span>}
		</div>
	);
};

export default TextInput;
