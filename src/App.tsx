import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AlbumPage from './pages/AlbumPage'
import EditPage from './pages/EditPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/album/:id" element={<AlbumPage />} />
      <Route path="/edit" element={<EditPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}
