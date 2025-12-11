import { cn } from '@/shared/lib/utils'
import type { TabNavigationProps } from '../model/types'

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b">
      <div className="container px-4">
        <nav className="flex gap-4">
          <button
            onClick={() => onTabChange('content')}
            className={cn(
              'py-3 px-1 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'content'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            콘텐츠
          </button>
          <button
            onClick={() => onTabChange('alarm')}
            className={cn(
              'py-3 px-1 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'alarm'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            알람
          </button>
        </nav>
      </div>
    </div>
  )
}
