import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./components/HomePage"
import GroupsPage from "./components/GroupsPage"
import ProfilePage from "./components/ProfilePage"
import "./App.css"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="container">
                <HomePage />
              </div>
            </>
          }
        />
        <Route
          path="groups"
          element={
            <div className="container">
              <GroupsPage />
            </div>
          }
        />
        <Route
          path="profile/:id"
          element={
            <div className="container">
              <ProfilePage />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
