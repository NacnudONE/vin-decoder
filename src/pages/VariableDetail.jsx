import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { getVariables } from '../api/nhtsa'
import ErrorMessage from '../components/ErrorMessage'

export default function VariableDetail() {
  const { id } = useParams()
  const { state } = useLocation()

  const [variable, setVariable] = useState(state?.variable ?? null)
  const [loading, setLoading] = useState(!state?.variable)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (state?.variable) return
    getVariables()
      .then((data) => {
        const found = data.Results?.find((v) => String(v.ID) === id)
        if (!found) setError('Змінну не знайдено.')
        else setVariable(found)
      })
      .catch((err) => setError(`Помилка завантаження: ${err.message}`))
      .finally(() => setLoading(false))
  }, [id, state?.variable])

  return (
    <section className="variable-detail" aria-label="Деталі змінної">
      <p className="variable-detail__back">
        <Link to="/variables">← Назад до списку</Link>
      </p>

      <ErrorMessage message={error} />

      {loading && <p className="loading">Завантаження…</p>}

      {variable && (
        <>
          <h1>{variable.Name}</h1>
          <div className="variable-detail__meta">
            <span className="badge">ID: {variable.ID}</span>
            {variable.DataType && (
              <span className="badge">Тип: {variable.DataType}</span>
            )}
            {variable.GroupName && (
              <span className="badge">Група: {variable.GroupName}</span>
            )}
          </div>
          {variable.Description ? (
            <div
              className="variable-detail__description"
              dangerouslySetInnerHTML={{ __html: variable.Description }}
            />
          ) : (
            <p className="not-found">Опис відсутній.</p>
          )}
        </>
      )}

      {!loading && !variable && !error && (
        <p className="not-found">Змінну з ID {id} не знайдено.</p>
      )}
    </section>
  )
}
