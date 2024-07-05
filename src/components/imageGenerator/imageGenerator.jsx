import "./imageGenerator.css";
import default_image from "../assets/ai-art.jpg";
import { useRef, useState } from "react";

export const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState("/");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const imageGenerate = async () => {


    if (inputRef.current.value === "") return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "User-Agent": "Chrome",
          },
          body: JSON.stringify({
            prompt: inputRef.current.value,
            n: 1,
            size: "512x512",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const data = await response.json();
      const generatedImageUrl = data?.data?.[0]?.url;

      if (generatedImageUrl) {
        setImageUrl(generatedImageUrl);
      } else {
        throw new Error("No image URL found in response");
      }
    } catch (err) {
      console.error("Error fetching image:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        AI Image <span>Generator</span>
      </div>
      <div className="img-loading">
        <div className="image">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : imageUrl !== "/" ? (
            <img src={imageUrl} alt="Generated" style={{ width: "400px", height: "400px" }} />
          ) : (
            <img src={default_image} alt="Default" style={{ width: "400px", height: "400px" }} />
          )}
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe what you want to generate"
        />
        <div className="generate-btn" onClick={imageGenerate}>
          Generate
        </div>
      </div>
    </div>
  );
};
