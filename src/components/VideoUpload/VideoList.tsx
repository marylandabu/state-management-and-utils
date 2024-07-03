import { useEffect, useState } from "react";
import {
  CircularProgress,
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { authAxios } from "../../utils/api/auth/authApi";

interface VideoListProps {
  apiEndpoint: string;
  userId: string;
}

export const VideoList: React.FC<VideoListProps> = ({
  apiEndpoint,
  userId,
}) => {
  const [videos, setVideos] = useState<string[]>([]);
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
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId, apiEndpoint]);

  const formatDateFromFilename = (filename: string) => {
    const timestamp = filename.match(/(\d+)_/);
    if (timestamp) {
      const date = new Date(parseInt(timestamp[1], 10));
      return date.toLocaleDateString();
    }
    return "Unknown Date";
  };

  if (loading) {
    return (
      <>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <Container sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Videos
        </Typography>
        <Grid container spacing={4}>
          {videos.length > 0 ? (
            videos.map((videoUrl, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card>
                  <CardMedia
                    component="video"
                    controls
                    src={videoUrl}
                    title={`Video ${index + 1}`}
                  />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      Uploaded on:{" "}
                      {formatDateFromFilename(
                        videoUrl.split("/").pop() || "Unknown Filename"
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No videos found.</Typography>
          )}
        </Grid>
      </Container>
    </>
  );
};
