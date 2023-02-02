import classNames from 'classnames'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Spinner } from '../../components/Spinner'
import { useGetPostsQuery } from '../api/apiSlice'
import { PostAuthor } from './PostAuthor'
import { Post } from './postsSlice'
import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from './TimeAgo'

type Props = {
  post: Post
}
const PostExcerpt = ({ post }: Props) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <PostAuthor userId={post.user} />
      <TimeAgo timestamp={post.date} />
      <ReactionButtons postReactions={post.reactions} postId={post.id} />
      <div />
      <Link to={`posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

export const PostsList = () => {
  const {
    data: posts = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch,
  } = useGetPostsQuery()

  const sortedPosts = useMemo(() => {
    const postsCopy = posts.slice()
    postsCopy.sort((a, b) => b.date.localeCompare(a.date))
    return postsCopy
  }, [posts])

  let content
  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = (
      <div className={classNames('posts-container', { disabled: isFetching })}>
        {sortedPosts.map((post) => (
          <PostExcerpt key={post.id} post={post} />
        ))}
      </div>
    )
  } else if (isError) {
    content = <div>Error occured</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch Posts</button>
      {content}
    </section>
  )
}
