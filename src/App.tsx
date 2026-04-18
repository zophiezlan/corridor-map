import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './routes/Home';
import { Inputs } from './routes/Inputs';
import { Map } from './routes/Map';
import { CorridorDetail } from './routes/CorridorDetail';
import { About } from './routes/About';
import { InputsProvider } from './state/InputsContext';

function App() {
  return (
    <InputsProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/inputs" element={<Inputs />} />
            <Route path="/map" element={<Map />} />
            <Route path="/corridor/:name" element={<CorridorDetail />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </InputsProvider>
  );
}

export default App;
