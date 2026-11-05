import { useLocation } from "react-router-dom";
import { AppRoutes } from "./app/router";
import Ambient from "./components/common/Ambient";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Header from "./components/common/Header";

export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      <Ambient />
      <a className="skip-link" href="#main">
        דלג לתוכן
      </a>
      <div className="container">
        <Header />
        <main id="main">
          {/* Keyed by route: a crash does not stick after navigating, and every page fades in. */}
          <ErrorBoundary key={pathname}>
            <div className="page">
              <AppRoutes />
            </div>
          </ErrorBoundary>
        </main>
      </div>
    </>
  );
}
