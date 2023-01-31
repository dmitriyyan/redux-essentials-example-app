import { Link, RouteComponentProps } from 'react-router-dom'

import { selectUserById } from '../users/usersSlice'
import { selectPostsByUser } from '../posts/postsSlice'
import { useAppSelector } from '../../app/hooks'

export const UserPage = ({
  match,
}: RouteComponentProps<{ userId: string }>) => {
  const { userId } = match.params

  const user = useAppSelector((state) => selectUserById(state, userId))

  const postsForUser = useAppSelector((state) =>
    selectPostsByUser(state, userId)
  )

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      {!user ? (
        <h2>User not found</h2>
      ) : (
        <>
          <h2>{user.name}</h2>
          <ul>{postTitles}</ul>
        </>
      )}
    </section>
  )
}
