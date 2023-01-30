import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { sub } from 'date-fns'

export type Reaction = 'thumbsUp' | 'hooray' | 'heart' | 'rocket' | 'eyes'
export type Reactions = {
  [Key in Reaction]?: number
}
export const reactions = [
  'thumbsUp',
  'hooray',
  'heart',
  'rocket',
  'eyes',
] as const

export const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

export type Post = {
  id: string
  title: string
  content: string
  user: string
  date: string
  reactions: Reactions
}

type InitialStateType = Post[]

const initialState: InitialStateType = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Hello!',
    user: '1',
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: {
      thumbsUp: 1,
      hooray: 3,
      heart: 5,
      rocket: 6,
      eyes: 2,
    },
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'More text',
    user: '2',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: {
      thumbsUp: 12,
      hooray: 3,
      heart: 8,
      rocket: 21,
      eyes: 53,
    },
  },
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.push(action.payload)
      },
      prepare: (title: string, content: string, userId: string) => {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            user: userId,
            date: new Date().toISOString(),
            reactions: {},
          },
        }
      },
    },
    postUpdated: (
      state,
      action: PayloadAction<Omit<Post, 'date' | 'reactions' | 'user'>>
    ) => {
      const { id, title, content } = action.payload
      const existingPost = state.find((post) => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded: (
      state,
      action: PayloadAction<{ postId: string; reaction: Reaction }>
    ) => {
      const { postId, reaction } = action.payload
      const existingPost = state.find((post) => post.id === postId)
      if (existingPost) {
        const reactionValue = existingPost.reactions[reaction] ?? 0
        existingPost.reactions[reaction] = reactionValue + 1
      }
    },
  },
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer
