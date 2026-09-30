import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { features } from './config/features'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {features.map(({ path, page: Page }) => (
          <Route key={path} path={path} element={<Page />} />
        ))}
      </Route>
    </Routes>
  )
}
