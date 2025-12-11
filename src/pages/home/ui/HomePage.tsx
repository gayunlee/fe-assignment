import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { TabNavigation, ContentTypeTab, type TabType } from '@/widgets/tabs'
import { ContentList } from '@/widgets/content-list'
import { AlarmList } from '@/widgets/alarm-list'
import { NewPostModal } from './NewPostModal'

const CONTENT_TYPES = ['일반', '공지', '이벤트', '프로모션']

export function HomePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('content')
  const [activeContentType, setActiveContentType] = useState('')
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)

  const handleNewPost = () => {
    setIsNewPostModalOpen(true)
  }

  const handleNewPostSelect = (useDraft: boolean) => {
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

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'content' && (
        <>
          <ContentTypeTab
            activeType={activeContentType}
            onTypeChange={setActiveContentType}
            types={CONTENT_TYPES}
          />
          <main className="container px-4">
            <ContentList category={activeContentType || undefined} />
          </main>
        </>
      )}

      {activeTab === 'alarm' && (
        <main className="container px-4 py-4">
          <AlarmList />
        </main>
      )}

      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onSelect={handleNewPostSelect}
      />
    </div>
  )
}
