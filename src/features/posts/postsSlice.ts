import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit'

import { RootState } from './../../app/store'
import { client } from '../../api/client'

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

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

type InitialState = {
  status: string
  error: string | null
}

const initialState = postsAdapter.getInitialState<InitialState>({
  status: 'idle',
  error: null,
})

export const addNewPost = createAsyncThunk<
  Post,
  Omit<Post, 'id' | 'date' | 'reactions'>
>(
  'posts/addNewPost',
  // The payload creator receives the partial `{title, content, user}` object
  async (initialPost) => {
    // We send the initial data to the fake API server
    const response = await client.post('/fakeApi/posts', initialPost)
    // The response includes the complete post object, including unique ID
    return response.data
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postUpdated: (
      state,
      action: PayloadAction<Omit<Post, 'date' | 'reactions' | 'user'>>
    ) => {
      const { id, title, content } = action.payload
      const existingPost = state.entities[id]
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
      const existingPost = state.entities[postId]
      if (existingPost) {
        const reactionValue = existingPost.reactions[reaction] ?? 0
        existingPost.reactions[reaction] = reactionValue + 1
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addNewPost.fulfilled, (state, action) => {
      // We can directly add the new post object to our posts array
      postsAdapter.addOne(state, action.payload)
    })
  },
})

export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors<RootState>((state) => state.posts)

export const selectPostsForUser = createSelector(
  (data: Post[] | undefined) => data,
  (data: Post[] | undefined, userId: string) => userId,
  (data, userId: string) => data?.filter((post) => post.user === userId) ?? []
)
