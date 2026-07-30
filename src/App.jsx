import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Variables from './pages/Variables'
import VariableDetail from './pages/VariableDetail'

export default function App() {
  return (
    <HashRouter>
      <header className="site-header">
        <div className="container">
          <nav className="site-nav" aria-label="Основна навігація">
            <NavLink to="/" end className="nav-brand">
              VIN Decoder
            </NavLink>
            <NavLink to="/variables" className="nav-link">
              Змінні
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="site-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/variables" element={<Variables />} />
            <Route path="/variables/:id" element={<VariableDetail />} />
          </Routes>
        </div>
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>
            Дані надані{' '}
            <a
              href="https://vpic.nhtsa.dot.gov/api/"
              target="_blank"
              rel="noreferrer"
            >
              NHTSA vPIC API
            </a>
          </p>
        </div>
      </footer>
    </HashRouter>
  )
}
