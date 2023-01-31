import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './PostAuthor'
import { fetchPosts, selectPostById, selectPostIds } from './postsSlice'
import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from './TimeAgo'

type Props = {
  postId: string
}
const PostExcerpt = ({ postId }: Props) => {
  const post = useAppSelector((state) => selectPostById(state, postId))

  if (!post) {
    return null
  }

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
  const dispatch = useAppDispatch()
  const posts = useAppSelector(selectPostIds)
  const postsStatus = useAppSelector((state) => state.posts.status)
  const error = useAppSelector((state) => state.posts.error)

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postsStatus, dispatch])

  let content
  if (postsStatus === 'loading') {
    content = <Spinner text="Loading..." />
  } else if (postsStatus === 'succeeded') {
    content = posts.map((postId) => (
      <PostExcerpt key={postId} postId={postId.toString()} />
    ))
  } else if (postsStatus === 'failed') {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
