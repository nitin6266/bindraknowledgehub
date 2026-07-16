import { z } from "zod";

import {
  MASTER_MODULES,
  MODULE_NAME_KEY,
  SESSION_STATUS_OPTIONS,
  MASTER_STATUS_OPTIONS,
  CALENDAR_EVENT_OPTIONS,
  type MasterModuleKey,
} from "./constants";
import type {
  ColumnConfig,
  FieldConfig,
  MasterFormValues,
  MasterModuleConfig,
  MasterRow,
} from "./types";

function statusField(label: string, options: readonly { value: string; label: string }[]): FieldConfig {
  return {
    key: "status",
    label,
    type: "select",
    required: true,
    options: options.map((o) => ({ value: o.value, label: o.label })),
  };
}

export const MASTER_MODULE_CONFIGS: Record<MasterModuleKey, MasterModuleConfig> = {
  "academic-session": {
    key: "academic-session",
    title: "Academic Sessions",
    singular: "Academic Session",
    description: "Define academic years. Only one session can be active at a time.",
    statusField: "status",
    fields: [
      { key: "name", label: "Session Name", type: "text", required: true, placeholder: "2025-26" },
      { key: "startDate", label: "Start Date", type: "date", required: true },
      { key: "endDate", label: "End Date", type: "date", required: true },
      statusField("Status", SESSION_STATUS_OPTIONS),
      { key: "description", label: "Description", type: "textarea" },
    ],
    columns: [
      { key: "name", label: "Session", render: "text", sortable: true },
      { key: "startDate", label: "Start", render: "date", sortable: true },
      { key: "endDate", label: "End", render: "date", sortable: true },
      { key: "status", label: "Status", render: "status", sortable: true },
      { key: "description", label: "Description", render: "text", hideable: true },
    ],
  },

  class: {
    key: "class",
    title: "Classes",
    singular: "Class",
    description: "Manage grade levels from Class 3 to Class 12.",
    statusField: "status",
    fields: [
      { key: "name", label: "Class Name", type: "text", required: true, placeholder: "Class 3" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "displayOrder", label: "Display Order", type: "number", min: 0, placeholder: "0" },
      statusField("Status", MASTER_STATUS_OPTIONS),
    ],
    columns: [
      { key: "name", label: "Class", render: "text", sortable: true },
      { key: "displayOrder", label: "Order", render: "number", sortable: true },
      { key: "status", label: "Status", render: "status", sortable: true },
      { key: "description", label: "Description", render: "text", hideable: true },
    ],
  },

  section: {
    key: "section",
    title: "Sections",
    singular: "Section",
    description: "Sections within a class (A, B, C, D or custom).",
    statusField: "status",
    fields: [
      { key: "name", label: "Section Name", type: "text", required: true, placeholder: "A" },
      {
        key: "classId",
        label: "Linked Class",
        type: "relation",
        relation: "class",
        required: true,
      },
      statusField("Status", MASTER_STATUS_OPTIONS),
    ],
    columns: [
      { key: "name", label: "Section", render: "text", sortable: true },
      { key: "class", label: "Class", render: "relation" },
      { key: "status", label: "Status", render: "status", sortable: true },
    ],
  },

  subject: {
    key: "subject",
    title: "Subjects",
    singular: "Subject",
    description: "Subjects taught and the classes they apply to.",
    statusField: "status",
    fields: [
      { key: "name", label: "Subject Name", type: "text", required: true, placeholder: "Mathematics" },
      { key: "code", label: "Subject Code", type: "text", required: true, placeholder: "MATH" },
      { key: "description", label: "Description", type: "textarea" },
      {
        key: "classes",
        label: "Applicable Classes",
        type: "relation",
        relation: "class",
        multiple: true,
      },
      statusField("Status", MASTER_STATUS_OPTIONS),
    ],
    columns: [
      { key: "name", label: "Subject", render: "text", sortable: true },
      { key: "code", label: "Code", render: "text", sortable: true },
      { key: "classes", label: "Classes", render: "relation" },
      { key: "status", label: "Status", render: "status", sortable: true },
    ],
  },

  "time-slot": {
    key: "time-slot",
    title: "Time Slots",
    singular: "Time Slot",
    description: "Reusable period templates such as 08:00 – 09:00.",
    statusField: "status",
    fields: [
      { key: "name", label: "Slot Name", type: "text", required: true, placeholder: "08:00 – 09:00" },
      { key: "startTime", label: "Start Time", type: "time", required: true },
      { key: "endTime", label: "End Time", type: "time", required: true },
      { key: "displayOrder", label: "Display Order", type: "number", min: 0, placeholder: "0" },
      statusField("Status", MASTER_STATUS_OPTIONS),
    ],
    columns: [
      { key: "name", label: "Slot", render: "text", sortable: true },
      { key: "startTime", label: "Start", render: "text", sortable: true },
      { key: "endTime", label: "End", render: "text", sortable: true },
      { key: "displayOrder", label: "Order", render: "number", sortable: true },
      { key: "status", label: "Status", render: "status", sortable: true },
    ],
  },

  "batch-timing": {
    key: "batch-timing",
    title: "Batch Timings",
    singular: "Batch Timing",
    description: "Reusable timing templates: Morning, Evening, Weekend, Online, Custom.",
    statusField: "status",
    fields: [
      { key: "name", label: "Timing Name", type: "text", required: true, placeholder: "Morning" },
      { key: "description", label: "Description", type: "textarea" },
      statusField("Status", MASTER_STATUS_OPTIONS),
    ],
    columns: [
      { key: "name", label: "Timing", render: "text", sortable: true },
      { key: "description", label: "Description", render: "text", hideable: true },
      { key: "status", label: "Status", render: "status", sortable: true },
    ],
  },

  "batch-type": {
    key: "batch-type",
    title: "Batch Types",
    singular: "Batch Type",
    description: "Delivery modes: Offline, Online, Hybrid, Crash Course, Foundation, Board Prep.",
    statusField: "status",
    fields: [
      { key: "name", label: "Type Name", type: "text", required: true, placeholder: "Offline" },
      { key: "description", label: "Description", type: "textarea" },
      statusField("Status", MASTER_STATUS_OPTIONS),
    ],
    columns: [
      { key: "name", label: "Type", render: "text", sortable: true },
      { key: "description", label: "Description", render: "text", hideable: true },
      { key: "status", label: "Status", render: "status", sortable: true },
    ],
  },

  "academic-calendar": {
    key: "academic-calendar",
    title: "Academic Calendar",
    singular: "Calendar Event",
    description: "Holidays, exams, parent meetings, results and workshops.",
    statusField: "status",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Summer Break" },
      { key: "date", label: "Date", type: "date", required: true },
      {
        key: "eventType",
        label: "Event Type",
        type: "select",
        required: true,
        options: CALENDAR_EVENT_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
      },
      { key: "description", label: "Description", type: "textarea" },
      statusField("Status", MASTER_STATUS_OPTIONS),
    ],
    columns: [
      { key: "title", label: "Title", render: "text", sortable: true },
      { key: "date", label: "Date", render: "date", sortable: true },
      { key: "eventType", label: "Event Type", render: "badge", sortable: true },
      { key: "status", label: "Status", render: "status", sortable: true },
    ],
  },
};

export function getModuleConfig(module: string): MasterModuleConfig | null {
  if ((MASTER_MODULES as readonly string[]).includes(module)) {
    return MASTER_MODULE_CONFIGS[module as MasterModuleKey];
  }
  return null;
}

export function nameKeyFor(module: MasterModuleKey): string {
  return MODULE_NAME_KEY[module];
}

/** Builds a Zod schema dynamically from a module's field config. */
export function buildZodSchema(config: MasterModuleConfig): z.ZodType<MasterFormValues> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of config.fields) {
    switch (field.type) {
      case "text":
      case "time": {
        const base = z.string();
        shape[field.key] = field.required === false ? base.optional().or(z.literal("")) : base.min(1, `${field.label} is required`);
        break;
      }
      case "textarea": {
        shape[field.key] = z.string().optional().or(z.literal(""));
        break;
      }
      case "number": {
        const num = z.coerce.number({ invalid_type_error: `${field.label} must be a number` });
        shape[field.key] = field.required === false ? num.optional() : num;
        break;
      }
      case "date": {
        shape[field.key] = field.required === false ? z.string().optional().or(z.literal("")) : z.string().min(1, `${field.label} is required`);
        break;
      }
      case "select": {
        const allowed = field.options?.map((o) => o.value) ?? [];
        const enumerated = z.enum(allowed as [string, ...string[]]);
        shape[field.key] = field.required === false ? enumerated.optional().or(z.literal("")) : enumerated;
        break;
      }
      case "boolean": {
        shape[field.key] = z.boolean().optional();
        break;
      }
      case "relation": {
        if (field.multiple) {
          shape[field.key] = z.array(z.string());
        } else {
          const base = z.string();
          shape[field.key] = field.required === false ? base.optional().or(z.literal("")) : base.min(1, `${field.label} is required`);
        }
        break;
      }
    }
  }

  return z.object(shape);
}

/** Converts a raw repository row into form values (dates -> ISO yyyy-MM-dd). */
export function rowToFormValues(row: MasterRow, config: MasterModuleConfig): MasterFormValues {
  const values: MasterFormValues = {};

  for (const field of config.fields) {
    const raw = row[field.key];

    if (field.type === "date") {
      values[field.key] = raw ? new Date(raw as string | Date).toISOString().slice(0, 10) : "";
    } else if (field.type === "relation" && field.multiple) {
      if (Array.isArray(raw)) {
        values[field.key] = (raw as Array<{ id?: string }>).map((r) => String(r.id ?? "")).filter(Boolean);
      } else {
        values[field.key] = [];
      }
    } else if (field.type === "relation") {
      values[field.key] = raw ? String((raw as { id?: string }).id ?? "") : "";
    } else if (field.type === "number") {
      values[field.key] = raw == null ? (field.required === false ? "" : 0) : Number(raw);
    } else {
      values[field.key] = raw == null ? "" : String(raw);
    }
  }

  return values;
}

/** Builds a Prisma `data` payload from validated form values. */
export function serializeForPrisma(config: MasterModuleConfig, values: MasterFormValues): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  for (const field of config.fields) {
    const value = values[field.key];

    if (field.type === "date") {
      data[field.key] = value ? new Date(String(value)) : undefined;
    } else if (field.type === "relation" && field.multiple) {
      const ids = Array.isArray(value) ? (value as string[]).filter(Boolean) : [];
      data[field.key] = { set: ids.map((id) => ({ id })) };
    } else if (field.type === "relation") {
      data[field.key] = value ? value : undefined;
    } else if (field.type === "number") {
      data[field.key] = value === "" || value == null ? (field.required === false ? undefined : 0) : Number(value);
    } else if (field.type === "boolean") {
      data[field.key] = value ?? false;
    } else {
      data[field.key] = value === "" ? undefined : value;
    }
  }

  return data;
}

export type { ColumnConfig, FieldConfig, MasterModuleConfig };
