import React from "react";
import { fieldChecker } from "../../types/form";

interface RadioInputProps {
	field: fieldChecker;
	answer: string;
	error: string;
	changeValueCB: (id: number, value: string) => void;
}

const RadioInput = (props: RadioInputProps) => {
	const { field, answer, changeValueCB } = props;
	const [options] = React.useState(field.options!.split(","));

	return (
		<div className="flex flex-col">
			<div>
				<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
					{field.label}
				</label>
				<div className="max-w-lg flex flex-wrap justify-start gap-x-4 gap-y-1">
					{options.map((option, index) => (
						<div key={index} className="flex gap-2 items-center">
							<input
								className="w-4 h-4"
								type="radio"
								name={field.label}
								checked={answer === option}
								value={option}
								onChange={(e) => changeValueCB(field.id!, e.target.value)}
							/>
							<label>{option}</label>
						</div>
					))}
				</div>
				{props.error && <span className="text-sm text-red-600">{props.error}</span>}
			</div>
		</div>
	);
};

export default RadioInput;
