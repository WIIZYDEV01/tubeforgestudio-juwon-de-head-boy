"use client";

import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

function message<T extends FieldValues>(form: UseFormReturn<T>, name: FieldPath<T>) {
  const error = form.formState.errors[name];
  return typeof error?.message === "string" ? error.message : undefined;
}

export function TextField<T extends FieldValues>({
  form,
  name,
  label,
  hint,
  area = false,
  className,
}: {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
  area?: boolean;
  className?: string;
}) {
  const error = message(form, name);
  return (
    <label className={className}>
      <span className="label">{label}</span>
      {area ? <textarea className="field min-h-28" {...form.register(name)} /> : <input className="field" {...form.register(name)} />}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : null}
    </label>
  );
}

export function NumberField<T extends FieldValues>({
  form,
  name,
  label,
  hint,
  className,
}: {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
  className?: string;
}) {
  const error = message(form, name);
  return (
    <label className={className}>
      <span className="label">{label}</span>
      <input className="field" type="number" {...form.register(name, { valueAsNumber: true })} />
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : null}
    </label>
  );
}

export function SelectField<T extends FieldValues>({
  form,
  name,
  label,
  options,
  hint,
  className,
}: {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  options: { label: string; value: string }[];
  hint?: string;
  className?: string;
}) {
  const error = message(form, name);
  return (
    <label className={className}>
      <span className="label">{label}</span>
      <select className="field" {...form.register(name)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : null}
    </label>
  );
}

export function CheckField<T extends FieldValues>({
  form,
  name,
  label,
  hint,
}: {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
}) {
  const error = message(form, name);
  return (
    <label className="flex items-start gap-3 border border-line px-3 py-3">
      <input className="mt-1 accent-[#ff6b24]" type="checkbox" {...form.register(name)} />
      <span>
        <span className="block text-sm">{label}</span>
        {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
        {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : null}
      </span>
    </label>
  );
}
