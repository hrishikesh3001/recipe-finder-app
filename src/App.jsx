import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Intro from "./pages/Intro"
import Home from "./pages/Home"
import RecipeDetails from "./pages/RecipeDetails"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
