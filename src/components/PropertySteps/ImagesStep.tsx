import React, { useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { Delete, ZoomIn } from "@mui/icons-material";

interface ImagesStepProps {
  data: string[];
  files: File[];
  onChange: (images: string[]) => void;
  onFilesChange: (files: File[]) => void;
}

export const ImagesStep: React.FC<ImagesStepProps> = ({
  data,
  files,
  onChange,
  onFilesChange,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      onFilesChange([...files, ...acceptedFiles]);
      onChange([...data, ...newPreviews]);
    },
    [data, files, onChange, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
  "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 20,
  maxSize: 10 * 1024 * 1024,
  });

  const handleRemove = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);

    const newFiles = [...files];
    newFiles.splice(index - (data.length - files.length), 1);

    onChange(newData);
    onFilesChange(newFiles);
  };

  const isExistingImage = (src: string) =>
    src.startsWith("http") || src.startsWith("/");

  const openImage = (src: string) => window.open(src, "_blank");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="subtitle1">Imagini proprietate</Typography>

      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          border: "2px dashed",
          borderColor: isDragActive ? "primary.main" : "divider",
          backgroundColor: isDragActive ? "action.hover" : "background.paper",
          textAlign: "center",
          cursor: "pointer",
          transition: "0.2s",
          "&:hover": { borderColor: "primary.main" },
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="body1">
          {isDragActive
            ? "Elibereaza pentru a adauga imaginile..."
            : "Trage imaginile aici sau fa click pentru a le selecta"}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Acepta pana la 20 imagini, max 10MB fiecare
        </Typography>
      </Paper>


      <Grid container spacing={2}>
        {data.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ p: 2, ml: 2 }}
          >
            Nu exista imagine incarcata.
          </Typography>
        )}

        {data.map((img, index) => (
          <Grid key={index} size={3}>
            <Box
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 2,
                "&:hover img": { transform: "scale(1.05)" },
                "&:hover .actions": { opacity: 1 },
              }}
            >
              <img
                src={img}
                alt={`img-${index}`}
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  transition: "transform 0.2s ease-in-out",
                }}
              />

              <Box
                className="actions"
                sx={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  display: "flex",
                  gap: 0.5,
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
              >
                <Tooltip title="Vezi imaginea">
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                    }}
                    onClick={() => openImage(img)}
                  >
                    <ZoomIn fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Sterge imaginea">
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                    }}
                    onClick={() => handleRemove(index)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {isExistingImage(img) && (
                <Chip
                  label="Existenta"
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "white",
                  }}
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Typography variant="body2" color="text.secondary" mt={1}>
        Total imagini: {data.length} ({data.filter(isExistingImage).length}{" "}
        existente, {files.length} noi)
      </Typography>
    </Box>
  );
};
