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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { authAxios } from "../../utils/api/auth/authApi";

interface FileListProps {
  apiEndpoint: string;
  userId: string;
}

interface FileData {
  url: string;
  type: string;
  original_filename: string;
  parent_folder_id: number | null;
  id: number;
}

export const FileList: React.FC<FileListProps> = ({ apiEndpoint, userId }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState<FileData[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [targetFolder, setTargetFolder] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    authAxios
      .get(`${apiEndpoint}/users/${userId}/files`)
      .then((response) => {
        const files = response.data.files;
        setFiles(files);
        const uniqueFolders = files.filter(
          (file: FileData) => file.type === "folder"
        );
        setFolders(uniqueFolders);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
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

  const handleMoveFile = async () => {
    if (!selectedFile || targetFolder === null) return;

    try {
      await authAxios.post(`${apiEndpoint}/users/${userId}/move_file`, {
        fileUrl: selectedFile.url,
        targetFolder,
      });

      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.url === selectedFile.url
            ? { ...file, parent_folder_id: targetFolder }
            : file
        )
      );

      setSelectedFile(null);
      setTargetFolder(null);
    } catch (error) {
      console.error("Error moving file:", error);
    }
  };

  const groupedFiles = files.reduce(
    (acc: { [key: number]: FileData[] }, file) => {
      const folderId = file.parent_folder_id || 0;
      acc[folderId] = acc[folderId] || [];
      acc[folderId].push(file);
      return acc;
    },
    {}
  );

  const renderFiles = (folderId: number) => (
    <Grid container spacing={4}>
      {groupedFiles[folderId]?.map((file) => (
        <Grid item xs={12} md={6} lg={4} key={file.url}>
          <Card>
            {file.type.startsWith("video") ? (
              <CardMedia component="video" controls src={file.url} />
            ) : (
              <CardMedia component="img" src={file.url} />
            )}
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                Uploaded on:{" "}
                {formatDateFromFilename(
                  file.url.split("/").pop() || "Unknown Filename"
                )}
              </Typography>
              <Button
                onClick={() => setSelectedFile(file)}
                variant="outlined"
                size="small"
              >
                Move
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {groupedFiles[folderId]?.length === 0 && (
        <Typography>No files found.</Typography>
      )}
    </Grid>
  );

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

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Files
      </Typography>
      {groupedFiles[0]?.map((folder) => (
        <Accordion key={folder.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${folder.id}-content`}
            id={`${folder.id}-header`}
          >
            <Typography variant="h6">{folder.original_filename}</Typography>
          </AccordionSummary>
          <AccordionDetails>{renderFiles(folder.id)}</AccordionDetails>
        </Accordion>
      ))}
      {selectedFile && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Move File</Typography>
          <Select
            value={targetFolder}
            onChange={(e) => setTargetFolder(Number(e.target.value))}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Select Folder
            </MenuItem>
            {folders.map((folder) => (
              <MenuItem key={folder.id} value={folder.id}>
                {folder.original_filename}
              </MenuItem>
            ))}
          </Select>
          <Button
            onClick={handleMoveFile}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Move
          </Button>
        </Box>
      )}
    </Container>
  );
};
