export interface Dashboard {
  id: string
  title: string
  embedUrl: string
  description?: string
}

export interface Module {
  id: string
  title: string
  description: string
  icon: string
  isActive: boolean
  dashboards: Dashboard[]
}
