import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createContent } from '../api'
import { contentKeys } from '@/entities/content'
import type { CreateContentRequest, CreateContentResponse } from '../../model/types'

export function useCreateContent() {
  const queryClient = useQueryClient()

  return useMutation<CreateContentResponse, Error, CreateContentRequest>({
    mutationFn: createContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys._def })
    },
  })
}
