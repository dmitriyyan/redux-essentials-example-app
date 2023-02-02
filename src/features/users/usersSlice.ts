import { apiSlice } from './../api/apiSlice'
import { RootState } from './../../app/store'
import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'

export type User = {
  id: string
  name: string
}

const usersAdapter = createEntityAdapter<User>()

const initialState = usersAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<typeof initialState, void>({
      query: () => '/users',
      transformResponse: (responseData: User[]) =>
        usersAdapter.setAll(initialState, responseData),
    }),
  }),
})

export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select()
export const { useGetUsersQuery } = extendedApiSlice

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data
)

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors<RootState>(
    (state) => selectUsersData(state) ?? initialState
  )
