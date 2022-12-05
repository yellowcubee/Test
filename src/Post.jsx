import React, { useEffect, useState } from "react";
import axios from "axios";
import Comments from "./Comments";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [id, setId] = useState("");
  const [volume, setVolume] = useState(10);
  const [filter, setFilter] = useState("straight");
  const [getError, setGetError] = useState("");
  const [postById, setPostById] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [comments, setComments] = useState([]);
  const [curentPage, setCurentPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [posts2, setPosts2] = useState([]);

  let copy = posts2;

  const scrollHandler = (e) => {
    if (
      e.target.documentElement.scrollHeight -
        (e.target.documentElement.scrollTop + window.innerHeight) <
      100
    ) {
      setFetching(true);
    }
  };
  useEffect(() => {
    if (fetching) {
      axios
        .get("https://jsonplaceholder.typicode.com/posts", {
          params: { _limit: volume, _page: curentPage },
        })
        .then((res) => {
          if (filter === "straight") {
            setGetError("");

            setPostById([]);
            setGetError("");
            setPosts2([...posts2, ...res.data]);
            setCurentPage((prevState) => prevState + 1);
          } else {
            setPosts(res.data.reverse());
          }
        })
        .finally(() => setFetching(false));
    }
  }, [fetching]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);

    return function () {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const createPosts = () => {
    if (id === "") {
      setFetching(true);
    } else {
      axios
        .get(`https://jsonplaceholder.typicode.com/posts/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setPostById([res.data]);
          setPosts2([]);
          setId("");
          setGetError("");
        })
        .catch(() => {
          setPosts2([]);
          setPostById([]);
          setFetching(false);
          setCurentPage(1);
          setGetError(
            "Возможно, вы ввели неверное значение ID. Введите значение от 1 до 100."
          );
          setPosts([]);
        });
      setId("");
    }
  };

  const createComment = (id) => {
    axios
      .get(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
      .then((res) => {
        setComments(res.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <div className="settings">
        <input
          type="text"
          placeholder="enter id..."
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <select
          className="selector1"
          onChange={(e) => setVolume(e.target.value)}
        >
          <option>10</option>
          <option>20</option>
          <option>50</option>
          <option>100</option>
        </select>

        <select
          className="selector2"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value={"straight"}>ID up</option>
          <option value={"reverse"}>id down</option>
        </select>
        <button onClick={createPosts} className="button">
          Get posts
        </button>
      </div>
      <div className="posts">
        Posts
        {posts.map((e) => {
          <div>{e.id}</div>;
        })}
        {filter === "straight" ? (
          <div>
            {copy
              ?.sort((a, b) => a.id - b.id)
              .map((post) => (
                <div
                  key={post.id}
                  className="post"
                  onDoubleClick={() => {
                    setModalActive(true);
                    createComment(post.id);
                  }}
                >
                  <div className="title">{post.title}</div>
                  <div className="text">{post.id}</div>
                </div>
              ))}
          </div>
        ) : (
          <div>
            {copy
              ?.sort((a, b) => b.id - a.id)
              .map((post) => (
                <div
                  key={post.id}
                  className="post"
                  onDoubleClick={() => {
                    setModalActive(true);
                    createComment(post.id);
                  }}
                >
                  <div className="title">{post.title}</div>
                  <div className="text">{post.id}</div>
                </div>
              ))}
          </div>
        )}
      </div>
      {
        <div>
          {getError === "" ? (
            postById?.map((postid) => (
              <div
                key={postid.id}
                className="post"
                onDoubleClick={() => {
                  setModalActive(true);
                  createComment(postid.id);
                }}
              >
                <div className="title">{postid.title}</div>
                <div className="text">{postid.id}</div>
              </div>
            ))
          ) : (
            <div className="post">
              <div>{getError}</div>
            </div>
          )}
        </div>
      }
      <Comments
        active={modalActive}
        setActive={setModalActive}
        comments={comments}
        setComments={setComments}
      />
    </div>
  );
};

export default Post;
