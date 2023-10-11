import { FieldValues, UseFormHandleSubmit } from "react-hook-form";

type OnSubmitHandlerType = <TData extends FieldValues>(
  event: React.FormEvent<HTMLFormElement>,
  submitHandlerFunc: UseFormHandleSubmit<TData>,
  submitFunc: (formData: TData) => void,
) => void;

const onSubmitHandler: OnSubmitHandlerType = (
  event,
  submitHandlerFunc,
  submitFunc,
) => {
  event.preventDefault();
  void submitHandlerFunc(submitFunc)(event);
};

export default onSubmitHandler;
