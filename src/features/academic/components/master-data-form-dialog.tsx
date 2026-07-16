"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler, type UseFormRegister, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

import { buildZodSchema } from "@/features/academic/master-data/config";
import type {
  FieldConfig,
  MasterFormValues,
  MasterModuleConfig,
  SelectOption,
} from "@/features/academic/master-data/types";

interface MasterDataFormDialogProps {
  config: MasterModuleConfig;
  relationOptions: Record<string, SelectOption[]>;
  initialValues: MasterFormValues | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: MasterFormValues) => Promise<{ success: true } | { success: false; error: string }>;
}

function buildDefaults(config: MasterModuleConfig, initial: MasterFormValues | null): MasterFormValues {
  const defaults: MasterFormValues = {};
  for (const f of config.fields) {
    if (initial) {
      const value = initial[f.key];
      if (value != null) {
        defaults[f.key] = value;
        continue;
      }
    }
    if (f.type === "number") {
      defaults[f.key] = 0;
    } else if (f.type === "relation" && f.multiple) {
      defaults[f.key] = [];
    } else if (f.type === "boolean") {
      defaults[f.key] = false;
    } else {
      defaults[f.key] = "";
    }
  }
  return defaults;
}

export function MasterDataFormDialog({
  config,
  relationOptions,
  initialValues,
  open,
  onOpenChange,
  onSubmit,
}: MasterDataFormDialogProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isEdit = initialValues != null;
  const schema = buildZodSchema(config);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MasterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: buildDefaults(config, initialValues),
  });

  const submit: SubmitHandler<MasterFormValues> = async (values) => {
    setServerError(null);
    setPending(true);
    try {
      const result = await onSubmit(values);
      if (result.success) {
        reset();
        onOpenChange(false);
        router.refresh();
      } else {
        setServerError(result.error);
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit ${config.singular}` : `Create ${config.singular}`}</DialogTitle>
          <DialogDescription>
            {isEdit ? `Update the ${config.singular.toLowerCase()} details.` : `Add a new ${config.singular.toLowerCase()} to the master data.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {config.fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          register={register}
          relationOptions={relationOptions[field.key] ?? []}
          error={(errors as Record<string, { message?: string } | undefined>)[field.key]?.message}
        />
      ))}

          {serverError ? (
            <p className="rounded-md bg-destructive/10 p-3 text-body-sm text-destructive" role="alert">
              {serverError}
            </p>
          ) : null}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" loading={pending} disabled={pending}>
              {isEdit ? "Save changes" : `Create ${config.singular}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface FieldRendererProps {
  field: FieldConfig;
  register: UseFormRegister<MasterFormValues>;
  relationOptions: SelectOption[];
  error?: string;
}

function FieldRenderer({ field, register, relationOptions, error }: FieldRendererProps) {
  const labelId = `field-${field.key}`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={labelId}>{field.label}</Label>

      {field.type === "textarea" ? (
        <Textarea id={labelId} {...register(field.key as Path<MasterFormValues>)} placeholder={field.placeholder} aria-invalid={!!error} />
      ) : field.type === "number" ? (
        <Input
          id={labelId}
          type="number"
          min={field.min}
          max={field.max}
          {...register(field.key as Path<MasterFormValues>)}
          placeholder={field.placeholder}
          aria-invalid={!!error}
        />
      ) : field.type === "date" ? (
        <Input id={labelId} type="date" {...register(field.key as Path<MasterFormValues>)} aria-invalid={!!error} />
      ) : field.type === "time" ? (
        <Input id={labelId} type="time" {...register(field.key as Path<MasterFormValues>)} aria-invalid={!!error} />
      ) : field.type === "select" ? (
        <Select id={labelId} {...register(field.key as Path<MasterFormValues>)} aria-invalid={!!error} defaultValue="">
          <option value="">Select {field.label.toLowerCase()}</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      ) : field.type === "relation" && field.multiple ? (
        <div className="flex flex-wrap gap-2 rounded-md border border-border p-3" role="group" aria-label={field.label}>
          {relationOptions.length ? (
            relationOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-body-sm"
              >
                <input type="checkbox" value={opt.value} {...register(field.key as Path<MasterFormValues>)} className="size-4" />
                {opt.label}
              </label>
            ))
          ) : (
            <span className="text-body-sm text-muted-foreground">No options available yet.</span>
          )}
        </div>
      ) : field.type === "relation" ? (
        <Select id={labelId} {...register(field.key as Path<MasterFormValues>)} aria-invalid={!!error} defaultValue="">
          <option value="">Select {field.label.toLowerCase()}</option>
          {relationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input id={labelId} {...register(field.key as Path<MasterFormValues>)} placeholder={field.placeholder} aria-invalid={!!error} />
      )}

      {field.help ? <p className="text-body-sm text-muted-foreground">{field.help}</p> : null}
      {error ? <p className="text-body-sm text-destructive">{error}</p> : null}
    </div>
  );
}
