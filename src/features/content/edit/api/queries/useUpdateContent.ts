import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateContent } from '../api'
import { contentKeys } from '@/entities/content'
import type { UpdateContentRequest, UpdateContentResponse } from '../../model/types'

export function useUpdateContent() {
  const queryClient = useQueryClient()

  return useMutation<UpdateContentResponse, Error, UpdateContentRequest>({
    mutationFn: updateContent,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: contentKeys._def })
      queryClient.invalidateQueries({
        queryKey: contentKeys.detail(variables.id).queryKey,
      })
    },
  })
}
