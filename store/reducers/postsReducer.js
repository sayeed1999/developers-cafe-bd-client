import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  posts: [],
  status: "idle",
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/getAll", async () => {
  const response = await axios.get(
    `${process.env.NEXT_APP_API_URL}/newsfeed/posts`
  );
  return response.data;
});

export const fetchPostById = createAsyncThunk(
  "posts/getOne",
  async (postId) => {
    const response = await axios.get(
      `${process.env.NEXT_APP_API_URL}/newsfeed/posts/${postId}`
    );
    return response.data;
  }
);

export const createPost = createAsyncThunk(
  "posts/createOne",
  async (postBody, { getState }) => {
    const currentUser = getState().auth.currentUser;

    let newPost = {};
    newPost.body = postBody;
    newPost.likes = [];
    newPost.comments = [];
    newPost.userid = currentUser.userid;
    newPost.username = currentUser.username;
    newPost.createdAt = new Date();

    const response = await axios.post(
      `${process.env.NEXT_APP_API_URL}/newsfeed/posts`,
      newPost
    );
    return response.data;
  }
);

export const tapHeart = createAsyncThunk(
  "posts/updateOne",
  async (post, { getState }) => {
    const currentUser = getState().auth.currentUser;
    const userid = currentUser.userid;

    if (!post.likes) post.likes = [];

    if (post.likes.includes(userid)) {
      post = { ...post, likes: post.likes.filter((x) => x !== userid) };
    } else {
      post = { ...post, likes: [...post.likes, userid] };
    }

    const response = await axios.put(
      `${process.env.NEXT_APP_API_URL}/newsfeed/posts/${post._id}`,
      post
    );
    return post;
  }
);

const methods = [fetchPosts, fetchPostById, createPost, tapHeart];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    methods.forEach((m) => {
      builder
        .addCase(m.pending, (state, _action) => {
          state.status = "loading";
        })
        .addCase(m.fulfilled, (state, action) => {
          state.status = "succeeded";
          switch (m) {
            case fetchPosts:
              state.posts = action.payload;
              break;
            case createPost:
              state.posts.push(action.payload[0]);
              break;
            case tapHeart:
              const post = action.payload;
              const index = state.posts.findIndex((x) => x._id === post._id);
              state.posts[index] = post;
              break;
            default:
              break;
          }
        })
        .addCase(m.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        });
    });
  },
});

export default postsSlice.reducer;