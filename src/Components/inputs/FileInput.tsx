import { fieldChecker } from "../../types/form";

interface FileInputProps {
	field: fieldChecker;
	error: string;
	answer: string;
	changeValueCB: (id: number, value: string) => void;
}
const FileInput = (props: FileInputProps) => {
	const { field, answer, changeValueCB } = props;

	const handleInput = (file: FileList | null) => {
		if (file) {
			const name: string | undefined = file.item(0)?.name;
			changeValueCB(field.id!, name ? name : "file");
		}
	};

	return (
		<div className="flex flex-col">
			<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
				{props.field.label}
			</label>
			<span>{answer}</span>
			<input
				type="file"
				accept=".jpg"
				onChange={(e) => handleInput(e.target.files)}
			/>
			{props.error && <p className="text-sm text-red-600">{props.error}</p>}
		</div>
	);
};
export default FileInput;
