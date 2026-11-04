import { AppRoutes } from "./app/router";
import ErrorBoundary from "./components/common/ErrorBoundary";
import CursorGlow from "./components/fx/CursorGlow";
import ParticleField from "./components/fx/ParticleField";
import Header from "./components/common/Header";

export default function App() {
  return (
    <div className="container">
      <ParticleField />
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
