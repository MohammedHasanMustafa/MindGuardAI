import React, { useEffect, useState } from "react";
import ReactWordcloud from "react-wordcloud";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

const WordCloudPage = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWordData = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/insights/wordcloud", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch word cloud data");
        }

        const data = await res.json();
        console.log("Fetched words:", data);

        // Format data to match what react-wordcloud expects
        const formattedWords = (data.words || []).map((word) => ({
          text: word.text || word.word || "N/A",
          value: word.value || word.count || 1,
        }));

        setWords(formattedWords);
      } catch (err) {
        console.error("Word cloud fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWordData();
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-center">Loading word cloud...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">Error: {error}</p>;
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-6 text-center mx-auto max-w-3xl mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-[#297194]">AI Word Cloud</h2>
      <p className="text-sm text-gray-600 mb-4">Based on AI explanations from recent conversations.</p>

      {words.length > 0 ? (
        <div style={{ height: 400 }}>
          <ReactWordcloud words={words} />
        </div>
      ) : (
        <p className="text-gray-500">No words available to display.</p>
      )}
    </div>
  );
};

export default WordCloudPage;
