import { useEffect, useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { authAxios } from "../../utils/api/auth/authApi";

export const VoiceList = ({
  apiEndpoint,
  userId,
}: {
  apiEndpoint: string;
  userId: string;
}) => {
  const [audios, setAudios] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    authAxios
      .get(`${apiEndpoint}/users/${userId}/audio`)
      .then((response) => {
        const audioFiles = response.data.audios;
        setAudios(audioFiles);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching audios:", error);
        setLoading(false);
      });
  }, [userId, apiEndpoint]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">My Audios</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {audios.length > 0 ? (
          audios.map((audioUrl, index) => (
            <div key={index} className="relative rounded-lg shadow-md">
              <audio className="w-full" controls>
                <source src={audioUrl} type="audio/webm" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          ))
        ) : (
          <p>No audios found.</p>
        )}
      </div>
    </div>
  );
};
