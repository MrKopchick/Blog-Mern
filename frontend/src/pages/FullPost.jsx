import React from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axios from "../axios";

import { Post } from "../components/Post";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const {id} = useParams();
  
  React.useEffect(() => {
    axios.get(`/posts/${id}`).then(res =>{
      setData(res.data);
      setLoading(false);

    }).catch(err => {
      console.log(err);
      alert("помилка при отримані статі");
    });
  }, []);

  if(isLoading) return <Post isLoading={isLoading} isFullPost/>;
  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={`http://localhost:3002${data.imageUrl}`}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags = {data.tags}
        isFullPost
      >
        <ReactMarkdown children = {data.text} />
      </Post>
    </>
  );
};
