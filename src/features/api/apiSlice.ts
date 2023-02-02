// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post, Reaction } from '../posts/postsSlice'

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post', 'User'],
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getPosts: builder.query<Post[], void>({
      // The URL for the request is '/fakeApi/posts'
      query: () => '/posts',
      providesTags: (result = [], error, arg) => [
        ...result.map(({ id }) => ({ type: 'Post' as const, id })),
        { type: 'Post', id: 'LIST' },
      ],
    }),
    getPost: builder.query<Post, string>({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, arg) => [{ type: 'Post', id: arg }],
    }),
    addNewPost: builder.mutation<Post, Omit<Post, 'id' | 'date' | 'reactions'>>(
      {
        query: (initialPost) => ({
          url: '/posts',
          method: 'POST',
          // Include the entire post object as the body of the request
          body: initialPost,
        }),
        invalidatesTags: [{ type: 'Post', id: 'LIST' }],
      }
    ),
    editPost: builder.mutation<Post, Omit<Post, 'date' | 'reactions' | 'user'>>(
      {
        query: (post) => ({
          url: `/posts/${post.id}`,
          method: 'PATCH',
          body: post,
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
      }
    ),
    addReaction: builder.mutation<
      Reaction,
      { postId: string; reaction: Reaction }
    >({
      query: ({ postId, reaction }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reaction },
      }),
      async onQueryStarted(
        { postId, reaction }: { postId: string; reaction: Reaction },
        { dispatch, queryFulfilled }
      ) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
            const existingPost = draft.find((post) => post.id === postId)
            if (existingPost) {
              const reactionValue = existingPost.reactions[reaction] ?? 0
              existingPost.reactions[reaction] = reactionValue + 1
            }
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.postId },
      ],
    }),
  }),
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  // Posts
  useGetPostsQuery,
  useGetPostQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useAddReactionMutation,
} = apiSlice
