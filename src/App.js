import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios(
          "https://techcrunch.com/wp-json/wp/v2/posts?per_page=20&context=embed"
        );
        if (result.data.length === 0) {
          throw new Error("Results not found");
        }
        setPosts(result.data);
        setLoading(false);
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 404) {
            setError("Error: 404 Not Found");
          } else {
            setError(`Error: ${error.response.status} ${error.response.statusText}`);
          }
        } else if (error.request) {
          // The request was made but no response was received
          setError("Error: Network issue. Please try again later.");
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(`Error: ${error.message}`);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCardClick = (post) => {
    window.open(post.link, "_blank");
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1 style={{ textAlign: "center" }}>Most Recent Published Posts</h1>
      <div
        className="card-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {posts.map((post) => (
          <div className="card" key={post.id} onClick={() => handleCardClick(post)}>
            {post.featured_media_src_url && (
              <img src={post.featured_media_src_url} alt={post.title.rendered} />
            )}
            <div className="card-content">
              <h2>{post.title && post.title.rendered}</h2>
              <p>{post.excerpt && post.excerpt.rendered}</p>
              {post.link && (
                <a href={post.link} target="_blank" rel="noreferrer">
                  Read more
                </a>
              )}
              {post._embedded && post._embedded.author && (
                <p>By {post._embedded.author[0].name}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;