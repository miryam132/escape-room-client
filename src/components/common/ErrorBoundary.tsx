import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

type State = { hasError: boolean };

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div role="alert" className="not-found">
        <h1>משהו השתבש</h1>
        <button type="button" className="btn btn-primary" onClick={() => location.reload()}>
          טען מחדש
        </button>
      </div>
    );
  }
}
