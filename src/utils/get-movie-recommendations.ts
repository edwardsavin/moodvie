export default async function getMovieRecommendations(songs: string) {
  const response = await fetch("./api/movie-recommendations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ songs }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movie recommendations");
  }

  const data = (await response.json()) as { movieRecommendations: string[] };
  return data.movieRecommendations;
}
