import { Routes, Route } from "react-router-dom";
import Welcome from './pages/Welcome'
import Chat from './pages/Chat'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
};

export default App
