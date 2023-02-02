import { RouteComponentProps } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Spinner } from '../../components/Spinner'

import { useGetPostQuery } from '../api/apiSlice'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from './TimeAgo'

export const SinglePostPage = ({
  match,
}: RouteComponentProps<{ postId: string }>) => {
  const { postId } = match.params
  const { data: post, isFetching, isSuccess } = useGetPostQuery(postId)

  if (isFetching) {
    return <Spinner text="Loading..." />
  }

  if (!isSuccess) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
        <ReactionButtons postReactions={post.reactions} postId={post.id} />
        <div />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    </section>
  )
}
