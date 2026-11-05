import type { ReactNode } from "react";
import type { Difficulty } from "../../types/escapeRoom";
import { Icon } from "./Icon";

export const ErrorMessage = ({ errorMessage }: { errorMessage: string }) => (
  <div className="error-message">
    <Icon name="lock" />
    <p role="alert">{errorMessage}</p>
  </div>
);

export const Loading = () => (
  <div className="loading" role="status">
    <span className="spinner" aria-hidden="true" />
    <p>טוען...</p>
  </div>
);

type BadgeProps = { text: string; tone?: Difficulty | "neutral" };

export const Badge = ({ text, tone = "neutral" }: BadgeProps) => (
  <span className={`badge badge-${tone}`}>{text}</span>
);

type PageTitleProps = { eyebrow?: string; title: ReactNode; children?: ReactNode };

/** Consistent page heading: small label above, big title, optional lead text / actions below. */
export const PageTitle = ({ eyebrow, title, children }: PageTitleProps) => (
  <header className="page-title">
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h1>{title}</h1>
    {children}
  </header>
);

type TextInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  inputMode?: "text" | "numeric";
  className?: string;
};

export const TextInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoFocus,
  inputMode,
  className,
}: TextInputProps) => (
  <div className="form-field">
    <label htmlFor={id}>{label}</label>
    <input
      type="text"
      id={id}
      className={className}
      value={value}
      placeholder={placeholder}
      autoFocus={autoFocus}
      inputMode={inputMode}
      autoComplete="off"
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
