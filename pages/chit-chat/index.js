import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import Post from "../../components/modules/chit-chat/Post";
import SingleInputForm from "../../components/shared/SingleInputForm";
import { fetchPosts } from "../../store/reducers/postsReducer";

const ChitChat = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);

  const postStatus = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  const [postsToDisplay, setPostsToDisplay] = useState({});
  const [postBody, setPostBody] = useState("");

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  useEffect(() => {
    setPostsToDisplay(() => posts);
  }, [posts]);

  const createNewPost = () => {
    if (!postBody) {
      swal("Info", "Cannot post an empty post", "Info");
      return;
    }
  };

  return (
    <div className="row">
      <div className="col-md-12 mt-4 mb-2">
        {1 == 1 && (
          <SingleInputForm
            state={postBody}
            setState={setPostBody}
            type="textarea"
            onSubmit={createNewPost}
          />
        )}
      </div>
      {postsToDisplay &&
        Object.entries(postsToDisplay).map((entry) => (
          <div className="col-md-12" key={entry[0]}>
            <Post postId={entry[0]} post={entry[1]} />
          </div>
        ))}
    </div>
  );
};

export default ChitChat;
