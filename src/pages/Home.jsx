import { useState } from 'react'
import { decodeVin } from '../api/nhtsa'
import { validateVin } from '../utils/vin'
import { useVinHistory } from '../hooks/useVinHistory'
import ErrorMessage from '../components/ErrorMessage'

export default function Home() {
  const [inputVal, setInputVal] = useState('')
  const [validationError, setValidationError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [result, setResult] = useState(null)
  const { history, addVin } = useVinHistory()

  const handleDecode = async (vin) => {
    const vinClean = vin.trim().toUpperCase()
    const error = validateVin(vinClean)
    if (error) {
      setValidationError(error)
      return
    }
    setValidationError(null)
    setApiError(null)
    setLoading(true)
    setResult(null)
    try {
      const data = await decodeVin(vinClean)
      addVin(vinClean)
      setResult(data)
    } catch (err) {
      setApiError(`Помилка запиту: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleDecode(inputVal)
  }

  const handleHistoryClick = (vin) => {
    setInputVal(vin)
    handleDecode(vin)
  }

  const filteredResults = result?.Results?.filter(
    (r) => r.Value && r.Value !== 'Not Applicable' && r.Value !== ''
  ) ?? []

  const apiMessage = result?.Message

  return (
    <section aria-label="Декодування VIN">
      <h1>Декодування VIN-коду</h1>

      <form onSubmit={handleSubmit} className="vin-form" noValidate>
        <label htmlFor="vin-input" className="vin-form__label">
          Введіть VIN (до 17 символів)
        </label>
        <div className="vin-form__row">
          <input
            id="vin-input"
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value)
              if (validationError) setValidationError(null)
            }}
            maxLength={17}
            placeholder="Наприклад: 1FTFW1CT5DFC10312"
            className={`vin-input${validationError ? ' vin-input--error' : ''}`}
            aria-describedby={validationError ? 'vin-error' : undefined}
            aria-invalid={validationError ? 'true' : undefined}
            spellCheck={false}
            autoComplete="off"
          />
          <button
            type="submit"
            className="btn btn--primary"
            disabled={loading}
          >
            {loading ? 'Завантаження…' : 'Декодувати'}
          </button>
        </div>
        {validationError && (
          <p id="vin-error" role="alert" className="error-message">
            {validationError}
          </p>
        )}
      </form>

      {history.length > 0 && (
        <nav className="history" aria-label="Останні запити">
          <p className="history__label">Нещодавні запити:</p>
          <ul className="history__list">
            {history.map((vin) => (
              <li key={vin}>
                <button
                  type="button"
                  className="history__btn"
                  onClick={() => handleHistoryClick(vin)}
                >
                  {vin}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <ErrorMessage message={apiError} />

      {loading && <p className="loading">Запит до NHTSA API…</p>}

      {result && !loading && (
        <section className="results" aria-label="Результати декодування">
          {apiMessage && <p className="api-message">{apiMessage}</p>}

          {filteredResults.length > 0 ? (
            <>
              <h2 className="results__title">
                Результати ({filteredResults.length} полів)
              </h2>
              <table className="results__table">
                <thead>
                  <tr>
                    <th scope="col">Параметр</th>
                    <th scope="col">Значення</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((r) => (
                    <tr key={r.VariableId}>
                      <td className="results__var">{r.Variable}</td>
                      <td className="results__val">{r.Value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p>Дані відсутні або VIN не знайдено.</p>
          )}
        </section>
      )}
    </section>
  )
}
