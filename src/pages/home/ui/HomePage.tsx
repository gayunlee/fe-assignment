import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { TabNavigation, type TabType } from '@/widgets/tabs'
import { ContentList } from '@/widgets/content-list'
import { AlarmList } from '@/widgets/alarm-list'
import { NewPostModal } from './NewPostModal'

export function HomePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab') as TabType | null
  const [activeTab, setActiveTab] = useState<TabType>(tabParam === 'alarm' ? 'alarm' : 'content')
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setSearchParams(tab === 'alarm' ? { tab: 'alarm' } : {})
  }

  const handleNewPost = () => {
    setIsNewPostModalOpen(true)
  }

  const handleNewPostSelectContent = (useDraft: boolean) => {
    setIsNewPostModalOpen(false)
    if (useDraft) {
      navigate('/content/new?draft=true')
    } else {
      navigate('/content/new')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header variant="home" onNewPost={handleNewPost} />

      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === 'content' && (
        <main className="container px-4 py-4">
          <ContentList />
        </main>
      )}

      {activeTab === 'alarm' && (
        <main className="container px-4 py-4">
          <AlarmList />
        </main>
      )}

      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onSelectContent={handleNewPostSelectContent}
      />
    </div>
  )
}
