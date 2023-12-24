import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout.tsx";
import StatusPage from "./pages/StatusPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path={"/"} element={<StatusPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
