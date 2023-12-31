import { useState } from "react";

const url = "https://ws.audioscrobbler.com/2.0/?";

export const useFetchData = (user) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [error, setError] = useState();

  const getUserData = () => {
    const artistRequest = fetch(
      url +
        new URLSearchParams({
          method: "user.getTopArtists",
          user: user,
          period: "12month",
          limit: 5,
          api_key: "b2fb373ad4c40447fa74ddea3405be7a",
          format: "json",
        })
    )
      .then((response) => response.json())
      .catch((error) => console.error(error));

    const trackRequest = fetch(
      url +
        new URLSearchParams({
          method: "user.getTopTracks",
          user: user,
          period: "12month",
          limit: 5,
          api_key: "b2fb373ad4c40447fa74ddea3405be7a",
          format: "json",
        })
    )
      .then((response) => response.json())
      .catch((error) => console.error(error));

    const scrobbleRequest = fetch(
      url +
        new URLSearchParams({
          method: "user.getrecenttracks",
          user: user,
          api_key: "b2fb373ad4c40447fa74ddea3405be7a",
          format: "json",
        })
    )
      .then((response) => response.json())
      .catch((error) => console.error(error));

    setLoading(true);
    Promise.all([artistRequest, trackRequest, scrobbleRequest])
      .then(([artistData, trackData, scrobbleData]) => {
        const topArtist = artistData.topartists.artist[0].name;
        const token =
          "BQAVbjOwxfKGf380R7bIXc251cd4P3AytMrhoRNFrFU9wW2DJwKT_-tr6jU8DrZT5IanjcA-zhD0I4KIVmKtqLReqBy-1YPER2qzHC2PJjLC9fgnQ6E";
        const artistImageRequest = fetch(
          `https://api.spotify.com/v1/search?q=${topArtist}&type=artist`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        )
          .then((response) => response.json())
          .catch((error) => console.log(error));

        const albumImageRequest = fetch(
          `https://api.spotify.com/v1/search?q=${trackData.toptracks.track[0].name}-${trackData.toptracks.track[0].artist.name}&type=track`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        )
          .then((response) => response.json())
          .catch((error) => console.log(error));

        Promise.all([artistImageRequest, albumImageRequest]).then(
          ([artistImage, albumImage]) => {
            console.log(albumImage);
            setUserData({
              artistData: artistData.topartists.artist,
              trackData: trackData.toptracks.track,
              totalScrobbles: scrobbleData.recenttracks["@attr"].total,
              artistImage: artistImage.artists.items[0].images[2],
              albumImage: albumImage.tracks.items[0].album.images[2],
            });
          }
        );
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  return { getUserData, loading, userData, error };
};