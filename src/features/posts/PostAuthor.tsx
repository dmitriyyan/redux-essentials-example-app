import { useAppSelector } from '../../app/hooks'
import { selectUserById } from '../users/usersSlice'

type Props = {
  userId: string
}

export const PostAuthor = ({ userId }: Props) => {
  const author = useAppSelector((state) => selectUserById(state, userId))

  return <span>by {author ? author.name : 'Unknown author'}</span>
}
