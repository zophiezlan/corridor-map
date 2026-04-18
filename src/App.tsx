import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Layout } from "./components/Layout";
import { ScrollToTop } from "./components/ScrollToTop";
import { ErrorFallback } from "./components/ErrorFallback";
import { Home } from "./routes/Home";
import { Inputs } from "./routes/Inputs";
import { Map } from "./routes/Map";
import { CorridorDetail } from "./routes/CorridorDetail";
import { About } from "./routes/About";
import { NotFound } from "./routes/NotFound";
import { InputsProvider } from "./state/InputsContext";

function RoutedBoundary() {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[pathname]}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/inputs" element={<Inputs />} />
          <Route path="/map" element={<Map />} />
          <Route path="/corridor/:name" element={<CorridorDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <InputsProvider>
      <BrowserRouter>
        <ScrollToTop />
        <RoutedBoundary />
      </BrowserRouter>
    </InputsProvider>
  );
}

export default App;
