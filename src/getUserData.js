import { useState } from "react";

const url = "https://ws.audioscrobbler.com/2.0/?";

export const useFetchData = (user) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [error, setError] = useState();
  const [spotifyToken, setSpotifyToken] = useState();

  const API_KEY = process.env.REACT_APP_API_KEY;

  const authorizeSpotify = () => {
    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
      }),
    })
      .then((response) => response.json())
      .then((data) => setSpotifyToken(data.access_token))
      .catch((error) => {
        setError(error.message);
      });
  };

  const getUserData = () => {
    const artistRequest = fetch(
      url +
        new URLSearchParams({
          method: "user.getTopArtists",
          user: user,
          period: "12month",
          limit: 5,
          api_key: API_KEY,
          format: "json",
        })
    ).then((response) => response.json());

    const trackRequest = fetch(
      url +
        new URLSearchParams({
          method: "user.getTopTracks",
          user: user,
          period: "12month",
          limit: 5,
          api_key: API_KEY,
          format: "json",
        })
    ).then((response) => response.json());

    const scrobbleRequest = fetch(
      url +
        new URLSearchParams({
          method: "user.getrecenttracks",
          user: user,
          api_key: API_KEY,
          format: "json",
        })
    ).then((response) => response.json());

    setLoading(true);
    Promise.all([artistRequest, trackRequest, scrobbleRequest])
      .then(([artistData, trackData, scrobbleData]) => {
        if (
          !artistData.topartists.artist.length &&
          !trackData.toptracks.track.length
        ) {
          setError("No activity within the past year");
          setLoading(false);
          return;
        }

        const topArtist = artistData.topartists.artist[0].name;
        const artistImageRequest = fetch(
          `https://api.spotify.com/v1/search?q=${topArtist}&type=artist`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${spotifyToken}` },
          }
        ).then((response) => response.json());

        const albumImageRequest = fetch(
          `https://api.spotify.com/v1/search?q=${trackData.toptracks.track[0].name}-${trackData.toptracks.track[0].artist.name}&type=track`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${spotifyToken}` },
          }
        ).then((response) => response.json());

        Promise.all([artistImageRequest, albumImageRequest]).then(
          ([artistImage, albumImage]) => {
            setUserData({
              artistData: artistData.topartists.artist,
              trackData: trackData.toptracks.track,
              totalScrobbles: scrobbleData.recenttracks["@attr"].total,
              artistImage: artistImage.artists.items[0].images[2],
              albumImage: albumImage.tracks.items[0].album.images[2],
            });

            setLoading(false);
          }
        );
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to find data for that user");
        setLoading(false);
      });
  };

  return { authorizeSpotify, getUserData, loading, userData, error };
};
