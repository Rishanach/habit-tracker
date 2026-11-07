function CategoryFilter({ categories, value, onChange }) {
  return (
    <div className="category-filter" role="group" aria-label="Filter habits by category">
      <button
        type="button"
        className="category-filter-btn"
        aria-pressed={value === 'all'}
        onClick={() => onChange('all')}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className="category-filter-btn"
          aria-pressed={value === category.id}
          onClick={() => onChange(category.id)}
        >
          <span className="category-dot" style={{ backgroundColor: category.color }} aria-hidden="true" />
          {category.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
