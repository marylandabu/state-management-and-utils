import React from "react";
import { VideoUploader } from "./VideoUploader";
import { VideoList } from "./VideoList";
import { getConfig } from "../../utils/api/auth/config";
import { FileUploadS3Props } from "../../utils/types/weatherTypes";
import {
  CssBaseline,
  ThemeProvider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const VideoCapture: React.FC<FileUploadS3Props> = ({
  apiEndpoint,
  bucketName,
  userId,
  s3Client,
}) => {
  const { theme } = getConfig();
  const content = (
    <Box className="my-8">
      <VideoUploader
        s3Client={s3Client}
        apiEndpoint={apiEndpoint}
        bucketName={bucketName}
        userId={userId}
      />
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>My Videos</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <VideoList apiEndpoint={apiEndpoint} userId={userId} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  return theme ? (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {content}
    </ThemeProvider>
  ) : (
    content
  );
};
