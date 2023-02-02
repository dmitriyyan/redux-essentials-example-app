import { Link, RouteComponentProps } from 'react-router-dom'

import { selectUserById } from '../users/usersSlice'
import { useAppSelector } from '../../app/hooks'
import { useGetPostsQuery } from '../api/apiSlice'
import { selectPostsForUser } from '../posts/postsSlice'

export const UserPage = ({
  match,
}: RouteComponentProps<{ userId: string }>) => {
  const { userId } = match.params

  const user = useAppSelector((state) => selectUserById(state, userId))

  // Use the same posts query, but extract only part of its data
  const { postsForUser } = useGetPostsQuery(undefined, {
    selectFromResult: (result) => ({
      // We can optionally include the other metadata fields from the result here
      ...result,
      // Include a field called `postsForUser` in the hook result object,
      // which will be a filtered list of posts
      postsForUser: selectPostsForUser(result.data, userId),
    }),
  })
  console.log('rendering')
  return (
    <section>
      {!user ? (
        <h2>User not found</h2>
      ) : (
        <>
          <h2>{user.name}</h2>
          <ul>
            {postsForUser.map((post) => (
              <li key={post.id}>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
