"use client";

import { useController, Control, FieldValues, Path } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  id: string;
  placeholder?: string;
  options: readonly SelectOption[];
  orientation?: "horizontal" | "vertical" | "responsive";
}

export function SelectFormField<T extends FieldValues>({
  control,
  name,
  label,
  id,
  placeholder = "선택",
  options,
  orientation = "vertical",
}: SelectFormFieldProps<T>) {
  const { field } = useController({ name, control });

  return (
    <Field orientation={orientation}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
