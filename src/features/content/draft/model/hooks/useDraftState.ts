import { useState, useCallback, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { ContentDraft, ContentFormData } from '../types'
import { saveDraft, loadDraft, deleteDraft, hasDraft } from '../../lib/storage'

interface UseDraftStateOptions {
  authorId: number
  loadExisting?: boolean
}

interface UseDraftStateReturn {
  draft: ContentDraft | null
  hasDraft: boolean
  save: (data: Partial<ContentFormData>) => void
  load: () => ContentDraft | null
  clear: () => void
}

export function useDraftState(options: UseDraftStateOptions): UseDraftStateReturn {
  const { authorId, loadExisting = false } = options
  const [draft, setDraft] = useState<ContentDraft | null>(null)
  const [draftExists, setDraftExists] = useState<boolean>(false)

  useEffect(() => {
    setDraftExists(hasDraft())

    if (loadExisting) {
      const existingDraft = loadDraft()
      if (existingDraft) {
        setDraft(existingDraft)
      }
    }
  }, [loadExisting])

  const save = useCallback(
    (data: Partial<ContentFormData>) => {
      const newDraft: ContentDraft = {
        id: draft?.id ?? uuidv4(),
        data,
        savedAt: new Date().toISOString(),
        authorId,
      }

      saveDraft(newDraft)
      setDraft(newDraft)
      setDraftExists(true)
    },
    [authorId, draft?.id]
  )

  const load = useCallback(() => {
    const existingDraft = loadDraft()
    if (existingDraft) {
      setDraft(existingDraft)
    }
    return existingDraft
  }, [])

  const clear = useCallback(() => {
    deleteDraft()
    setDraft(null)
    setDraftExists(false)
  }, [])

  return {
    draft,
    hasDraft: draftExists,
    save,
    load,
    clear,
  }
}
