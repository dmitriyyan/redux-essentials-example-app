import { useLayoutEffect } from 'react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import classNames from 'classnames'

import { selectAllUsers } from '../users/usersSlice'

import {
  allNotificationsRead,
  selectMetadataEntities,
  useGetNotificationsQuery,
} from './notificationsSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

export const NotificationsList = () => {
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  const users = useAppSelector(selectAllUsers)

  const { data: notifications = [] } = useGetNotificationsQuery()
  const notificationsMetadata = useAppSelector(selectMetadataEntities)

  const renderedNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find((user) => user.id === notification.user) || {
      name: 'Unknown User',
    }
    const metadata = notificationsMetadata[notification.id]
    const notificationClassname = classNames('notification', {
      new: metadata?.isNew,
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
