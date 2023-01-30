import { useAppDispatch } from '../../app/hooks'
import {
  reactions,
  reactionEmoji,
  Reactions,
  reactionAdded,
} from './postsSlice'

type Props = {
  postId: string
  postReactions: Reactions
}

export const ReactionButtons = ({ postReactions, postId }: Props) => {
  const dispatch = useAppDispatch()

  const reactionButtons = reactions.map((name) => {
    return (
      <button
        onClick={() =>
          dispatch(reactionAdded({ postId: postId, reaction: name }))
        }
        key={name}
        type="button"
        className="muted-button reaction-button"
      >
        {reactionEmoji[name]} {postReactions[name]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}
