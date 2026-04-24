import { useQuery,useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser, deleteUser, getMe, getUser, getUsers, login, logout, updateUser } from '@/services/auth'

export const useLogin = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export const useLogout = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      qc.clear() 
    },
  })
}


export const useUsers = (params = {}) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params).then((res) => res.data),
    retry: false,
  })

export const useUser = (id) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id).then((res) => res.data),
    enabled: !!id,
  })

export const useCreateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export const useUpdateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export const useDeleteUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export const useAgents = () =>
  useQuery({
    queryKey: ['users', { role: 'AGENT' }],
    queryFn: () => getUsers({ role: 'AGENT' }).then((res) => res.data),
    retry: false,
  })

export const useAdmins = () =>
  useQuery({
    queryKey: ['users', { role: 'ADMIN' }],
    queryFn: () => getUsers({ role: 'ADMIN' }).then((res) => res.data),
    retry: false,
  })


export const useMe = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: () => getMe().then(res => res.data),
    retry: false,
  })

