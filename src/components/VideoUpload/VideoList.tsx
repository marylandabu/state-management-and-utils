import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { authAxios } from "../../utils/api/auth/authApi";

const VideoList = ({
  apiEndpoint,
  userId,
}: {
  apiEndpoint: string;
  userId: string;
}) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    authAxios
      .get(`${apiEndpoint}/users/${userId}/video`)
      .then((response) => {
        const vids = response.data.videos;
        setVideos(vids);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        setLoading(false);
      });
  }, [userId, apiEndpoint]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">My Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.length > 0 ? (
          videos.map((videoUrl, index) => (
            <div key={index} className="relative rounded-lg shadow-md">
              <video className="w-full h-auto" controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))
        ) : (
          <p>No videos found.</p>
        )}
      </div>
    </div>
  );
};

export default VideoList;
