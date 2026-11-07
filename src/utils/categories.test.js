import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { defaultCategories } from '../data/categories.js'
import { initialHabits } from '../data/habits.js'
import { createHabit, markHabitDone, updateHabit } from './habitStats.js'
import {
  createCategory,
  deleteCustomCategory,
  filterHabitsByCategory,
  setCategoryColor,
  updateCategory,
  validateCategoryEdit,
  validateHabitFields,
  validateNewCategory,
} from './categories.js'

function cloneCategories() {
  return defaultCategories.map((category) => ({ ...category }))
}

describe('habit categories', () => {
  it('ships the default categories and assigns them to the sample habits', () => {
    assert.deepEqual(
      defaultCategories.map((category) => category.name),
      ['Health', 'Fitness', 'Learning', 'Productivity', 'Personal']
    )
    assert.equal(new Set(defaultCategories.map((category) => category.color)).size, defaultCategories.length)
    for (const habit of initialHabits) {
      assert.ok(defaultCategories.some((category) => category.id === habit.categoryId))
    }
  })

  it('creates a custom category and rejects duplicates', () => {
    const created = validateNewCategory({ name: '  Mindfulness ', color: '#0f766e' }, cloneCategories())
    assert.equal(created.ok, true)
    const categories = createCategory(cloneCategories(), created.value)
    assert.equal(categories.at(-1).name, 'Mindfulness')
    assert.equal(categories.at(-1).builtIn, false)
    assert.equal(categories.at(-1).color, '#0f766e')

    const duplicate = validateNewCategory({ name: 'health', color: '#112233' }, categories)
    assert.equal(duplicate.ok, false)
  })

  it('renames and recolours custom categories only', () => {
    const custom = createCategory(cloneCategories(), { name: 'Mindfulness', color: '#0f766e' })
    const customId = custom.at(-1).id
    const edited = validateCategoryEdit(custom, customId, { name: 'Calm', color: '#abc' })
    assert.equal(edited.ok, true)
    assert.equal(edited.value.color, '#aabbcc')
    const next = updateCategory(custom, customId, edited.value)
    assert.equal(next.at(-1).name, 'Calm')

    const builtIn = validateCategoryEdit(custom, 'health', { name: 'Wellness', color: '#123456' })
    assert.equal(builtIn.ok, false)
  })

  it('lets every category change colour', () => {
    const result = setCategoryColor(cloneCategories(), 'fitness', '#123456')
    assert.equal(result.ok, true)
    assert.equal(result.categories.find((category) => category.id === 'fitness').color, '#123456')
    assert.equal(setCategoryColor(cloneCategories(), 'fitness', 'blue').ok, false)
  })

  it('deletes a custom category and moves its habits to Personal', () => {
    const categories = createCategory(cloneCategories(), { name: 'Mindfulness', color: '#0f766e' })
    const customId = categories.at(-1).id
    const habits = [{ id: 'h9', name: 'Breathe', streak: 3, categoryId: customId, pinned: false }]
    const removed = deleteCustomCategory(categories, habits, customId)

    assert.equal(removed.ok, true)
    assert.equal(removed.fallbackId, 'personal')
    assert.equal(removed.categories.some((category) => category.id === customId), false)
    assert.equal(removed.habits[0].categoryId, 'personal')
    assert.equal(removed.habits[0].streak, 3)
    assert.equal(deleteCustomCategory(categories, habits, 'health').ok, false)
  })

  it('filters habits without dropping the other category fields', () => {
    const habits = filterHabitsByCategory(initialHabits, 'learning')
    assert.deepEqual(habits.map((habit) => habit.name), ['Read 10 pages'])
    assert.equal(filterHabitsByCategory(initialHabits, 'all').length, initialHabits.length)
  })

  it('creates and edits a habit while keeping its streak', () => {
    const categories = cloneCategories()
    const fields = validateHabitFields(
      { name: ' Journal ', description: 'One page', targetPerWeek: '4', categoryId: 'personal' },
      categories
    )
    assert.equal(fields.ok, true)
    const created = createHabit([], fields.value)
    assert.equal(created[0].streak, 0)
    assert.equal(created[0].categoryId, 'personal')

    const done = markHabitDone(created, created[0].id)
    const edited = validateHabitFields(
      { name: 'Journal', description: '', targetPerWeek: 5, categoryId: 'learning' },
      categories
    )
    const updated = updateHabit(done, done[0].id, edited.value)
    assert.equal(updated[0].streak, 1)
    assert.equal(updated[0].completedThisWeek, 1)
    assert.equal(updated[0].categoryId, 'learning')
    assert.equal(updated[0].targetPerWeek, 5)
    assert.equal(validateHabitFields({ name: '', targetPerWeek: 1, categoryId: 'health' }, categories).ok, false)
  })
})
