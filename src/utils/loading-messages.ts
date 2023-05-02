export const getRandomFetchTracksMessage = () => {
  const messages = [
    "Loading your most recent tracks...",
    "Connecting to Spotify...",
    "Fetching your most recent tracks...",
    "Retrieving your most recent songs...",
    "Getting your most recent tracks...",
    "Analyzing your preferences...",
    "Preparing your personalized experience...",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};
