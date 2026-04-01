import React from 'react'
import { Input } from "@/components/ui/input";
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormFieldProps<T extends FieldValues>{
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'file' ;
}

const FormField = <T extends FieldValues>({ name, control, label, placeholder , type = "text" }: FormFieldProps<T>) => {
     return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <label
            htmlFor={field.name}
            className="label text-sm font-medium text-white"
          >
            {label}
          </label>

          <Input
            {...field}
            id={field.name}
            type={type}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
          />

          {fieldState.error && (
            <p className="text-sm text-red-500">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};

export default FormField;