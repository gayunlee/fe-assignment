import { useMutation, useQueryClient } from '@tanstack/react-query'
import { publishContent, scheduleContent } from '../api'
import { contentKeys } from '@/entities/content'
import type {
  PublishContentRequest,
  ScheduleContentRequest,
  PublishContentResponse,
} from '../../model/types'

export function usePublishContent() {
  const queryClient = useQueryClient()

  return useMutation<PublishContentResponse, Error, PublishContentRequest>({
    mutationFn: publishContent,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: contentKeys._def })
      queryClient.invalidateQueries({
        queryKey: contentKeys.detail(variables.id).queryKey,
      })
    },
  })
}

export function useScheduleContent() {
  const queryClient = useQueryClient()

  return useMutation<PublishContentResponse, Error, ScheduleContentRequest>({
    mutationFn: scheduleContent,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: contentKeys._def })
      queryClient.invalidateQueries({
        queryKey: contentKeys.detail(variables.id).queryKey,
      })
    },
  })
}
