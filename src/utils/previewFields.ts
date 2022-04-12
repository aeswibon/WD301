import { Error } from './../types/pagination';
import { Answer } from './../types/form';

export const validatePreviewForm = (answers: Answer[]) => {
	const errors: Error<Answer>[] = [];

	answers.forEach((answer) => {
		if (answer.value.length < 1 || answer.value.length > 100) {
			errors.push({
				form_field: String(answer.form_field),
				value: "Answer is required",
			});
		}
	});

	return errors;
};
