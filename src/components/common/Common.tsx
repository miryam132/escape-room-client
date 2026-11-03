export const ErrorMessage = ({ errorMessage }: { errorMessage: string }) => (
  <div className="error-message">
    <p role="alert">{errorMessage}</p>
  </div>
);

export const Loading = () => (
  <div className="loading">
    <p>טוען...</p>
  </div>
);

export const Badge = ({ text }: { text: string }) => <span className="badge">{text}</span>;

type TextInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const TextInput = ({ id, label, value, onChange, placeholder }: TextInputProps) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <input
      type="text"
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
