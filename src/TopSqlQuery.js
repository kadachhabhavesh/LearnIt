import { useEffect, useState } from "react";
import data from "./Data/SqlQuery.json";
import keywords from "./Data/KeyWords.json";
import functions from "./Data/Functions.json";

export default () => {
  useEffect(() => {
    fetch("https://66c1cbdbf83fffcb587a3a59.mockapi.io/doom/visiter", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Time: new Date(),
      })
    })
      .then((res) => console.log("success..."))
      .catch(err => console.log(err));
  }, []);

  const formatSql = (sql) => {
    const segments = sql.split(/(\s+|'[^']*'|[^\s]+)/).filter(Boolean);
    return segments.map((segment, index) => {
      // Check if segment is a keyword
      if (keywords.includes(segment.toUpperCase())) {
        return <span key={index} className="text-blue-600"> {segment} </span>;
      }
      // Check if segment is a function
      else if (functions.some(fn => segment.toUpperCase().startsWith(fn))) {
        // Separate function name from parameters (e.g., COUNT(*) -> COUNT and (*))
        const functionName = functions.find(fn => segment.toUpperCase().startsWith(fn));
        const remainingText = segment.slice(functionName.length);

        return (
          <span key={index}>
            <span className="text-pink-700">{functionName}</span>
            <span className="text-white">{remainingText}</span>
          </span>
        );
      }
      // Check if segment is a string literal
      else if (segment.startsWith("'") && segment.endsWith("'")) {
        return <span key={index} className="text-red-500"> {segment} </span>;
      }
      // Default color for other words
      else {
        return <span key={index} className="text-white"> {segment} </span>;
      }
    });
  }

  return (
    <div className="w-full px-4 py-6 sm:px-6 md:px-10 lg:px-20">
      <div className="w-full flex flex-col gap-4 mb-6">
        <header className="text-3xl md:text-4xl font-bold text-center">Most Asked SQL Interview Queries</header>
      </div>
      <div className="w-full flex flex-col gap-6">
        {data && data.map((question, index) => (
          <div key={index} className="w-full flex flex-col bg-gray-800 text-white p-4 rounded-md">
            <h1 className="text-lg md:text-xl font-semibold mb-2">{(index + 1) + ". " + question.question}</h1>
            <span className="font-semibold mb-2">Topics: {question.topics.join(", ")}</span>
            <div className="w-full bg-gray-900 text-white p-4 rounded-md">
              <pre className="whitespace-pre-line">
                {formatSql(question.answer)}
              </pre>  
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
