import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type PostType = {
  id: string
  title: string
  content: string
}

type InitialStateType = PostType[]

const initialState: InitialStateType = [
  { id: '1', title: 'First Post!', content: 'Hello!' },
  { id: '2', title: 'Second Post', content: 'More text' },
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: (state, action: PayloadAction<PostType>) => {
      state.push(action.payload)
    },
  },
})

export const { postAdded } = postsSlice.actions

export default postsSlice.reducer
