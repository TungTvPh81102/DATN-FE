export interface ICategory {
  id: number
  name: string
  parent_id?: number | null
  slug: string
  icon: null
  status: number
  deleted_at: null
  created_at: Date
  updated_at: Date
}
