import { useEffect, useId, useRef, useState } from 'react'
import { validateHabitFields } from '../utils/categories.js'

function HabitForm({ title, submitLabel, initialValue, categories, preferredCategoryId, onSave, onCancel }) {
  const nameId = useId()
  const descriptionId = useId()
  const targetId = useId()
  const categoryIdField = useId()
  const nameRef = useRef(null)
  const [name, setName] = useState(initialValue.name)
  const [description, setDescription] = useState(initialValue.description)
  const [targetPerWeek, setTargetPerWeek] = useState(String(initialValue.targetPerWeek))
  const [categoryId, setCategoryId] = useState(initialValue.categoryId)
  const [error, setError] = useState('')

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  useEffect(() => {
    if (categories.some((category) => category.id === categoryId)) return
    const next = categories.find((category) => category.id === preferredCategoryId)?.id ?? categories[0]?.id ?? ''
    setCategoryId(next)
  }, [categories, categoryId, preferredCategoryId])

  const selected = categories.find((category) => category.id === categoryId)

  function handleSubmit(event) {
    event.preventDefault()
    const result = validateHabitFields({ name, description, targetPerWeek, categoryId }, categories)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setError('')
    onSave(result.value)
  }

  return (
    <form className="panel habit-form" onSubmit={handleSubmit}>
      <h3>{title}</h3>
      <div className="habit-form-grid">
        <div className="field">
          <label htmlFor={nameId}>Name</label>
          <input
            id={nameId}
            ref={nameRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            required
          />
        </div>
        <div className="field">
          <label htmlFor={descriptionId}>Description</label>
          <textarea
            id={descriptionId}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={240}
            rows={2}
          />
        </div>
        <div className="habit-form-split">
          <div className="field">
            <label htmlFor={targetId}>Weekly target</label>
            <input
              id={targetId}
              type="number"
              min={1}
              max={99}
              step={1}
              inputMode="numeric"
              value={targetPerWeek}
              onChange={(event) => setTargetPerWeek(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor={categoryIdField}>Category</label>
            <div className="category-select">
              <span
                className="category-dot"
                style={{ backgroundColor: selected?.color ?? 'transparent' }}
                aria-hidden="true"
              />
              <select
                id={categoryIdField}
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="form-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" className="primary-btn">{submitLabel}</button>
      </div>
    </form>
  )
}

export default HabitForm
