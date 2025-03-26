export interface Notification {
  id: string
  type: string
  notifiable_type: string
  notifiable_id: number
  data: Data
  read_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface Data {
  course_id: number
  course_title?: null
  status?: string
  message: string
  note?: string
  type?: string
  course_name?: string
  course_slug?: string
  course_thumbnail?: string
  sender?: string
}
