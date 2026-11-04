import { AppRoutes } from "./app/router";
import Atmosphere from "./components/common/Atmosphere";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Header from "./components/common/Header";

export default function App() {
  return (
    <>
      <Atmosphere />
      <div className="container">
        <Header />
        <main>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </main>
        <footer>Mysteria · חדרי בריחה</footer>
      </div>
    </>
  );
}
