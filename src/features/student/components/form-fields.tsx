import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function Field({ label, required, type, value, onChange, placeholder, autoFocus }: FieldProps) {
  return (
    <div>
      <label className="block text-[14px] font-medium text-foreground mb-1.5">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      <input
        type={type ?? "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="h-[44px] w-full rounded-[10px] border border-border/60 bg-card px-3.5 text-[14px] text-foreground placeholder:text-muted-foreground/20 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/[0.06] transition-all"
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SelectField({ label, required, options, value, onChange, placeholder }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-[14px] font-medium text-foreground mb-1.5">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[44px] w-full rounded-[10px] border border-border/60 bg-card px-3.5 text-[14px] text-foreground appearance-none cursor-pointer focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/[0.06] transition-all"
      >
        <option value="">{placeholder ?? `Select ${label.toLowerCase()}`}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 3 }: TextAreaFieldProps) {
  return (
    <div>
      <label className="block text-[14px] font-medium text-foreground mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="h-[44px] w-full rounded-[10px] border border-border/60 bg-card px-3.5 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/20 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/[0.06] transition-all resize-none"
      />
    </div>
  );
}

export function FieldGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: 1 | 2 }) {
  return (
    <div className={cn("grid gap-5", cols === 2 ? "grid-cols-2" : "grid-cols-1")}>
      {children}
    </div>
  );
}

export function ReviewGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.08em] mb-3">{title}</p>
      <div className="rounded-[10px] border border-border/50 bg-card/50 divide-y divide-border/30">
        {children}
      </div>
    </div>
  );
}

export function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-[13px] text-muted-foreground/60">{label}</span>
      <span className="text-[14px] text-foreground font-medium text-right">{value}</span>
    </div>
  );
}
