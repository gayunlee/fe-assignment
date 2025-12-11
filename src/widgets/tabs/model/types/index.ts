export type TabType = 'content' | 'alarm'

export interface TabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export interface ContentTypeTabProps {
  activeType: string
  onTypeChange: (type: string) => void
  types: string[]
}
