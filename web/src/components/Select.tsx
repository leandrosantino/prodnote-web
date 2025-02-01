import { Controller, useFormContext } from "react-hook-form";


interface SelectInputProps {
  name: string;
  label: string;
  loading?: boolean;
  options: { value: string; label: string }[];
}

export function Select({ name, label, options, loading}: SelectInputProps){

  const { control } = useFormContext();

  return (
    <div className="flex flex-col" >
      <label htmlFor={name} className="ml-1 mb-1 font-medium" >{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <select
              {...field}
              className="p-2 border rounded-md"
            >
              {loading?<>
                <option value="">Carreando...</option>
              </>:<>
                <option value="">- Selecionar {label} -</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </>}
            </select>
            {fieldState.error && <span className="ml-1 text-red-500 text-sm" >
              {fieldState.error.message == 'Required'?'Campo Obrigatório': fieldState.error.message}
            </span>}
          </>
        )}
      />
    </div>
  )
}
