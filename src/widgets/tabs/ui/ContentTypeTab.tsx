import { cn } from '@/shared/lib/utils'
import type { ContentTypeTabProps } from '../model/types'

export function ContentTypeTab({
  activeType,
  onTypeChange,
  types,
}: ContentTypeTabProps) {
  const allTypes = ['전체', ...types]

  return (
    <div className="border-b bg-muted/40">
      <div className="container px-4">
        <nav className="flex gap-2 py-2 overflow-x-auto">
          {allTypes.map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(type === '전체' ? '' : type)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors',
                (type === '전체' && activeType === '') || type === activeType
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {type}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
