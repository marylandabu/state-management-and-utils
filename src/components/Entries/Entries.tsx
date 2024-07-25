import React, { useState, ChangeEvent, useEffect } from "react";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Button, TextField, ThemeProvider } from "@mui/material";
import {
  CircularProgress,
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { authAxios } from "../../utils/api/auth/authApi";
import { FileUploadS3Props } from "../../utils/types/weatherTypes";
import { getConfig } from "../../utils/api/auth/config";

interface JournalEntryUploaderProps {
  s3Client: S3Client;
  apiEndpoint: string;
  bucketName: string;
  userId: string;
}

export const JournalEntryUploader: React.FC<JournalEntryUploaderProps> = ({
  s3Client,
  apiEndpoint,
  bucketName,
  userId,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 && content === "") return;

    setLoading(true);

    const uploadedFileKeys = await Promise.all(
      selectedFiles.map(async (file) => {
        const fileKey = `journal_entries/${Date.now()}_${file.name}`;
        const uploadParams = {
          Bucket: bucketName,
          Key: fileKey,
          Body: file,
          ACL: "public-read",
        };

        try {
          // @ts-expect-error ignore
          const command = new PutObjectCommand(uploadParams);
          await s3Client.send(command);
          return fileKey;
        } catch (error) {
          console.error("Error uploading file:", error);
          return null;
        }
      })
    );

    const validFileKeys = uploadedFileKeys.filter((key) => key !== null);

    try {
      await authAxios.post(
        `${apiEndpoint}/users/${userId}/journal_entries/upload`,
        {
          journal_entry: { content },
          files: validFileKeys,
        }
      );
      alert("Journal entry uploaded successfully");
    } catch (error) {
      console.error("Error uploading journal entry:", error);
      alert("Failed to upload journal entry");
    } finally {
      setLoading(false);
      setSelectedFiles([]);
      setContent("");
    }
  };

  return (
    <Box sx={{ textAlign: "center", my: 4 }}>
      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}
      <Box>
        <TextField
          label="Content"
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <input
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-upload-input"
        />
        <label htmlFor="file-upload-input">
          <Button
            variant="contained"
            component="span"
            color="primary"
            sx={{ mb: 2 }}
          >
            Choose Files
          </Button>
        </label>
      </Box>
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={loading}
        >
          Upload Journal Entry
        </Button>
      </Box>
    </Box>
  );
};

interface JournalEntryListProps {
  apiEndpoint: string;
  userId: string;
}

interface JournalEntries {
  id: string;
  content: string;
  transcript?: string;
  files: string[];
}
export const JournalEntryList: React.FC<JournalEntryListProps> = ({
  apiEndpoint,
  userId,
}) => {
  const [journalEntries, setJournalEntries] = useState<JournalEntries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    authAxios
      .get(`${apiEndpoint}/users/${userId}/journal_entries/show`)
      .then((response) => {
        const entries = response.data.journal_entries;
        setJournalEntries(entries);
      })
      .catch((error) => {
        console.error("Error fetching journal entries:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId, apiEndpoint]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const renderMedia = (file: string) => {
    if (file.match(/\.(mp4|mov)$/)) {
      return <CardMedia component="video" controls src={file} />;
    } else if (file.match(/\.(mp3)$/)) {
      return <CardMedia component="audio" controls src={file} />;
    } else {
      return <CardMedia component="img" src={file} />;
    }
  };

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Journal Entries
      </Typography>
      <Grid container spacing={4}>
        {journalEntries.length > 0 ? (
          journalEntries.reverse().map((entry, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card>
                {entry.files.map((file: string, fileIndex: number) => (
                  <React.Fragment key={fileIndex}>
                    {renderMedia(file)}
                  </React.Fragment>
                ))}
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {entry.content}
                  </Typography>
                  {entry.transcript && (
                    <Typography variant="body2" color="textSecondary">
                      {entry.transcript}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No journal entries found.</Typography>
        )}
      </Grid>
    </Container>
  );
};

export const Entries: React.FC<FileUploadS3Props> = ({
  apiEndpoint,
  bucketName,
  userId,
  s3Client,
}) => {
  const content = (
      <div className="my-8">
        <JournalEntryUploader
          s3Client={s3Client}
          apiEndpoint={apiEndpoint}
          bucketName={bucketName}
          userId={userId}
        />
        <JournalEntryList apiEndpoint={apiEndpoint} userId={userId} />
      </div>
    ),
    { theme } = getConfig();

  return theme ? (
    <ThemeProvider theme={theme}>{content}</ThemeProvider>
  ) : (
    content
  );
};
