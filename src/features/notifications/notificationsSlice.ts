import { RootState } from './../../app/store'
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import { client } from '../../api/client'

type Notification = {
  id: string
  date: string
  user: string
  message: string
  read: boolean
  isNew: boolean
}

export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  { state: RootState }
>('notifications/fetchNotifications', async (_, { getState }) => {
  const allNotifications = selectAllNotifications(getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification ? latestNotification.date : ''
  const response = await client.get(
    `/fakeApi/notifications?since=${latestTimestamp}`
  )
  return response.data
})

const notificationsAdapter = createEntityAdapter<Notification>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState = notificationsAdapter.getInitialState()

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead: (state) => {
      state.ids.forEach((id) => {
        if (state.entities[id] !== undefined) {
          const entity = state.entities[id] as Notification
          entity.read = true
        }
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      notificationsAdapter.upsertMany(state, action.payload)
      state.ids.forEach((id) => {
        // Any notifications we've read are no longer new
        if (state.entities[id] !== undefined) {
          const entity = state.entities[id] as Notification
          entity.isNew = !entity.read
        }
      })
    })
  },
})

export default notificationsSlice.reducer
export const { allNotificationsRead } = notificationsSlice.actions
export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors<RootState>((state) => state.notifications)
