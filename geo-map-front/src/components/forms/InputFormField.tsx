"use client";

import { useController, Control, FieldValues, Path } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ReactNode } from "react";

export interface InputFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  id: string;
  placeholder?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  orientation?: "horizontal" | "vertical" | "responsive";
}

export function InputFormField<T extends FieldValues>({
  control,
  name,
  label,
  id,
  placeholder,
  prefix,
  suffix,
  orientation = "vertical",
}: InputFormFieldProps<T>) {
  const { field } = useController({ name, control });

  return (
    <Field orientation={orientation}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup className="overflow-hidden">
        <InputGroupInput
          id={id}
          placeholder={placeholder}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
        {prefix && (
          <InputGroupAddon align="inline-start">{prefix}</InputGroupAddon>
        )}
        {suffix && (
          <InputGroupAddon align="inline-end">{suffix}</InputGroupAddon>
        )}
      </InputGroup>
    </Field>
  );
}
