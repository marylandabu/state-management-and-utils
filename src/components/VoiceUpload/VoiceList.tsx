import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Paper, CircularProgress } from "@mui/material";
import { authAxios } from "../../utils/api/auth/authApi";

interface VoiceListProps {
  apiEndpoint: string;
  userId: string;
}

export const VoiceList: React.FC<VoiceListProps> = ({
  apiEndpoint,
  userId,
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
    return (
      <Box display="flex" justifyContent="center" alignItems="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box my={4}>
      <Typography variant="h4" component="h2" gutterBottom>
        My Audios
      </Typography>
      <Grid container spacing={2}>
        {audios.length > 0 ? (
          audios.map((audioUrl, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <audio controls style={{ width: "100%" }}>
                  <source src={audioUrl} type="audio/webm" />
                  Your browser does not support the audio tag.
                </audio>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No audios found.</Typography>
        )}
      </Grid>
    </Box>
  );
};
