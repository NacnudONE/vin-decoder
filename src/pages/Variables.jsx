import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getVariables } from '../api/nhtsa'
import ErrorMessage from '../components/ErrorMessage'

export default function Variables() {
  const [variables, setVariables] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getVariables()
      .then((data) => setVariables(data.Results ?? []))
      .catch((err) => setError(`Помилка завантаження: ${err.message}`))
      .finally(() => setLoading(false))
  }, [])

  const filtered = search
    ? variables.filter((v) =>
        v.Name?.toLowerCase().includes(search.toLowerCase())
      )
    : variables

  return (
    <section aria-label="Список змінних">
      <h1>Змінні NHTSA API</h1>

      <div className="variables-search">
        <label htmlFor="var-search" className="vin-form__label">
          Пошук за назвою
        </label>
        <input
          id="var-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Наприклад: Make, Model…"
          className="search-input"
        />
      </div>

      <ErrorMessage message={error} />

      {loading && <p className="loading">Завантаження списку змінних…</p>}

      {!loading && !error && (
        <>
          <p className="variables-count">
            {search
              ? `Знайдено ${filtered.length} із ${variables.length}`
              : `Всього ${variables.length} змінних`}
          </p>
          <ul className="variables-list">
            {filtered.map((v) => (
              <li key={v.ID}>
                <Link
                  to={`/variables/${v.ID}`}
                  state={{ variable: v }}
                  className="variable-item"
                >
                  <span className="variable-item__name">{v.Name}</span>
                  <span className="variable-item__type">{v.DataType}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
