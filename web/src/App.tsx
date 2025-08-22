import AppRouter from "./router";
import { AppLevelFallback } from "./components/error/app-level-fallback";
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <ErrorBoundary fallback={<AppLevelFallback />}>
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;
