export interface ICategory {
  id: number
  name: string
  slug: string
  parent_id: number | null
  icon: null
  status: 0 | 1
  deleted_at: Date | null
  created_at: Date
  updated_at: Date
}
