import { Controller, useFormContext } from "react-hook-form";

interface TextInputProps {
  name: string;
  label: string;
  placeholder?: string;
  type: 'text'|'date'|'number'
}

export function Input({ name, label, placeholder, type }: TextInputProps ) {

  const { control } = useFormContext();

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className="ml-1 mb-1 font-medium" >{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <input
              id={name} {...{type}} {...field}
              placeholder={placeholder}
              className="p-2 border rounded-md"
            />
            {fieldState.error && <span className="ml-1 text-red-500 text-sm" >
              {fieldState.error.message == 'Required'?'Campo Obrigatório': fieldState.error.message}
            </span>}
          </>
        )}
      />
    </div>
  )

}
