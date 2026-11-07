import { useId, useState } from 'react'
import {
  createCategory,
  setCategoryColor,
  updateCategory,
  validateCategoryEdit,
  validateNewCategory,
} from '../utils/categories.js'

function CategoryManager({ categories, habits, onChange, onDelete }) {
  const nameId = useId()
  const colorId = useId()
  const [name, setName] = useState('')
  const [color, setColor] = useState('#0f766e')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('#0f766e')
  const [editError, setEditError] = useState('')

  function handleCreate(event) {
    event.preventDefault()
    const result = validateNewCategory({ name, color }, categories)
    if (!result.ok) {
      setError(result.error)
      return
    }
    onChange(createCategory(categories, result.value))
    setName('')
    setColor('#0f766e')
    setError('')
  }

  function handleColorChange(categoryId, nextColor) {
    const result = setCategoryColor(categories, categoryId, nextColor)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setError('')
    onChange(result.categories)
  }

  function startEdit(category) {
    setEditingId(category.id)
    setEditName(category.name)
    setEditColor(category.color)
    setEditError('')
  }

  function handleEdit(event) {
    event.preventDefault()
    const result = validateCategoryEdit(categories, editingId, { name: editName, color: editColor })
    if (!result.ok) {
      setEditError(result.error)
      return
    }
    onChange(updateCategory(categories, editingId, result.value))
    setEditingId(null)
    setEditError('')
  }

  return (
    <section className="panel category-manager" id="category-manager" aria-labelledby="category-manager-heading">
      <h3 id="category-manager-heading">Categories</h3>
      <p className="panel-intro">
        Default categories stay in the list. Change any colour, or add your own.
      </p>
      <ul className="category-list">
        {categories.map((category) => {
          const habitCount = habits.filter((habit) => habit.categoryId === category.id).length
          const isEditing = editingId === category.id

          return (
            <li key={category.id} className="category-row">
              {isEditing ? (
                <form className="category-edit-form" onSubmit={handleEdit}>
                  <input
                    aria-label={`Name for ${category.name}`}
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    maxLength={32}
                    required
                  />
                  <input
                    type="color"
                    aria-label={`Colour for ${category.name}`}
                    value={editColor}
                    onChange={(event) => setEditColor(event.target.value)}
                  />
                  <button type="submit" className="primary-btn">Save</button>
                  <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                  {editError ? <p className="form-error" role="alert">{editError}</p> : null}
                </form>
              ) : (
                <>
                  <span className="category-dot" style={{ backgroundColor: category.color }} aria-hidden="true" />
                  <span className="category-row-name">{category.name}</span>
                  {category.builtIn ? <span className="habit-chip">Default</span> : null}
                  <span className="category-count">
                    {habitCount} {habitCount === 1 ? 'habit' : 'habits'}
                  </span>
                  {category.builtIn ? (
                    <input
                      type="color"
                      value={category.color}
                      aria-label={`Colour for ${category.name}`}
                      onChange={(event) => handleColorChange(category.id, event.target.value)}
                    />
                  ) : (
                    <div className="category-row-actions">
                      <button type="button" onClick={() => startEdit(category)}>Edit</button>
                      <button type="button" className="delete-btn" onClick={() => onDelete(category.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          )
        })}
      </ul>
      <form className="category-create-form" onSubmit={handleCreate}>
        <div className="field">
          <label htmlFor={nameId}>New category</label>
          <input
            id={nameId}
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={32}
            placeholder="Name"
          />
        </div>
        <div className="field color-field">
          <label htmlFor={colorId}>Colour</label>
          <input
            id={colorId}
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </div>
        <button type="submit" className="primary-btn">Add category</button>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
      </form>
    </section>
  )
}

export default CategoryManager
