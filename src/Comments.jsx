import React from "react";

function Comments({ active, setActive, comments, setComments }) {
  return (
    <div
      className={active ? "modal active" : "modal"}
      onClick={() => {
        setActive(false);
        setComments([]);
      }}
    >
      <div className="modal_content" onClick={(e) => e.stopPropagation()}>
        {comments.map((comment) => (
          <div key={comment.id}>
            <div>Name: {comment.name}</div>
            <div>Comment: {comment.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;
