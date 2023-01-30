import { createSlice } from '@reduxjs/toolkit'

type User = {
  id: string
  name: string
}

type InitialState = User[]

const initialState: InitialState = [
  { id: '0', name: 'Tianna Jenkins' },
  { id: '1', name: 'Kevin Grant' },
  { id: '2', name: 'Madison Price' },
]

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
})

export default usersSlice.reducer
