import { AppRoutes } from "./app/router";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Header from "./components/common/Header";

export default function App() {
  return (
    <div className="container">
      <Header />
      <main>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </main>
    </div>
  );
}
