export default async function getMovieRecommendations(
  songs: string,
  temperature: number
) {
  const response = await fetch("./api/movie-recommendations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ songs, temperature }),
  });

  if (!response.ok) {
    // In case of rate limiting, show a toast error to inform the user that they need to wait
    if (response.status === 500) {
      const data = (await response.json()) as { message: string };
      throw new Error(data.message);
    }

    throw new Error("Failed to fetch movie recommendations");
  }

  const data = (await response.json()) as { movieRecommendations: string[] };
  return data.movieRecommendations;
}
