import { formFieldChecker } from "./interfaces/inputFieldChecker";

const Form = () => {
  const formFields:formFieldChecker[] = [
    {
      id: 1, label: "First Name", type: "text",
    },
    {
      id: 2, label: "Last Name", type: "text"
    },
    {
      id: 3, label: "Email", type: "email"
    },
    {
      id: 4, label: "Date of Birth", type: "date"
    },
  ];

  return (
    <div>
      <form className="flex flex-col">
        {formFields.map(field => {
          return (
            <div key={field.id} className="w-full">
              <span className="text-lg font-semibold px-2">{field.label}</span>
              <input className="border-2 border-gray-200 bg-gray-200 rounded-lg p-2 my-2 w-full outline-none hover:outline-blue-800" type={field.type} placeholder={field.label} />
            </div>
          );
        })}
        <button type="submit" className="p-4 float-left mt-2 ml-0 mr-auto bg-blue-600 rounded-lg text-white font-bold">Submit</button>
      </form>
    </div>
  )
};

export default Form;