import { useAddReactionMutation } from '../api/apiSlice'
import { reactions, reactionEmoji, Reactions } from './postsSlice'

type Props = {
  postId: string
  postReactions: Reactions
}

export const ReactionButtons = ({ postReactions, postId }: Props) => {
  const [addReaction] = useAddReactionMutation()

  const reactionButtons = reactions.map((name) => {
    return (
      <button
        onClick={() => {
          addReaction({ postId, reaction: name })
        }}
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
