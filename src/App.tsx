import { AppRoutes } from "./app/router";
import ErrorBoundary from "./components/common/ErrorBoundary";
import CursorGlow from "./components/fx/CursorGlow";
import SmokeAura from "./components/fx/SmokeAura";
import Header from "./components/common/Header";

export default function App() {
  return (
    <div className="container">
      <SmokeAura />
      <CursorGlow />
      <Header />
      <main>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </main>
    </div>
  );
}
