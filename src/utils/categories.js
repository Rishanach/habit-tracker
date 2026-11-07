import { PERSONAL_CATEGORY_ID } from '../data/categories.js'

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/

export function normalizeColor(color) {
  const hex = String(color ?? '').trim().toLowerCase()
  if (!HEX_COLOR.test(hex)) return ''
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
  }
  return hex
}

export function isHexColor(color) {
  return normalizeColor(color) !== ''
}

function createId(prefix) {
  const random = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
  return `${prefix}-${random}`
}

function cleanName(name) {
  return String(name ?? '').trim().replace(/\s+/g, ' ')
}

export function findCategory(categories, categoryId) {
  return categories.find((category) => category.id === categoryId) ?? null
}

export function filterHabitsByCategory(habits, categoryId) {
  if (!categoryId || categoryId === 'all') return habits
  return habits.filter((habit) => habit.categoryId === categoryId)
}

export function validateHabitFields(input, categories) {
  const name = cleanName(input?.name)
  const description = cleanName(input?.description)
  const targetText = String(input?.targetPerWeek ?? '').trim()
  const categoryId = input?.categoryId

  if (!name) return { ok: false, error: 'Enter a habit name.' }
  if (name.length > 80) return { ok: false, error: 'Habit name must be 80 characters or fewer.' }
  if (description.length > 240) return { ok: false, error: 'Description must be 240 characters or fewer.' }
  if (!/^\d+$/.test(targetText)) {
    return { ok: false, error: 'Weekly target must be a whole number from 1 to 99.' }
  }

  const targetPerWeek = Number(targetText)
  if (targetPerWeek < 1 || targetPerWeek > 99) {
    return { ok: false, error: 'Weekly target must be a whole number from 1 to 99.' }
  }
  if (!findCategory(categories, categoryId)) return { ok: false, error: 'Choose a category.' }

  return {
    ok: true,
    value: { name, description, targetPerWeek, categoryId },
  }
}

export function validateNewCategory(input, categories) {
  const name = cleanName(input?.name)
  const color = normalizeColor(input?.color)

  if (!name) return { ok: false, error: 'Enter a category name.' }
  if (name.length > 32) return { ok: false, error: 'Category name must be 32 characters or fewer.' }
  if (categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
    return { ok: false, error: 'That category already exists.' }
  }
  if (!color) return { ok: false, error: 'Choose a colour.' }

  return { ok: true, value: { name, color } }
}

export function createCategory(categories, fields) {
  return [
    ...categories,
    {
      id: createId('category'),
      name: fields.name,
      color: fields.color,
      builtIn: false,
    },
  ]
}

export function validateCategoryEdit(categories, categoryId, input) {
  const current = findCategory(categories, categoryId)
  if (!current) return { ok: false, error: 'Category not found.' }
  if (current.builtIn) return { ok: false, error: 'Default categories cannot be renamed.' }

  const name = cleanName(input?.name)
  const color = normalizeColor(input?.color)
  if (!name) return { ok: false, error: 'Enter a category name.' }
  if (name.length > 32) return { ok: false, error: 'Category name must be 32 characters or fewer.' }
  const duplicate = categories.some(
    (category) => category.id !== categoryId && category.name.toLowerCase() === name.toLowerCase()
  )
  if (duplicate) return { ok: false, error: 'That category already exists.' }
  if (!color) return { ok: false, error: 'Choose a colour.' }

  return { ok: true, value: { name, color } }
}

export function updateCategory(categories, categoryId, fields) {
  return categories.map((category) =>
    category.id === categoryId
      ? { ...category, name: fields.name, color: fields.color }
      : category
  )
}

export function setCategoryColor(categories, categoryId, color) {
  const nextColor = normalizeColor(color)
  if (!findCategory(categories, categoryId)) return { ok: false, error: 'Category not found.' }
  if (!nextColor) return { ok: false, error: 'Choose a colour.' }

  return {
    ok: true,
    categories: categories.map((category) =>
      category.id === categoryId ? { ...category, color: nextColor } : category
    ),
  }
}

function fallbackCategoryId(categories, removedId) {
  const remaining = categories.filter((category) => category.id !== removedId)
  return (
    remaining.find((category) => category.id === PERSONAL_CATEGORY_ID)?.id ??
    remaining.find((category) => category.builtIn)?.id ??
    remaining[0]?.id ??
    null
  )
}

export function deleteCustomCategory(categories, habits, categoryId) {
  const current = findCategory(categories, categoryId)
  if (!current) return { ok: false, error: 'Category not found.' }
  if (current.builtIn) return { ok: false, error: 'Default categories cannot be deleted.' }

  const fallbackId = fallbackCategoryId(categories, categoryId)
  return {
    ok: true,
    fallbackId,
    categories: categories.filter((category) => category.id !== categoryId),
    habits: habits.map((habit) =>
      habit.categoryId === categoryId ? { ...habit, categoryId: fallbackId } : habit
    ),
  }
}
