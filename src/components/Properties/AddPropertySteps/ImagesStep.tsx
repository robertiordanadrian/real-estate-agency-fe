// components/Properties/AddPropertySteps/ImagesStep.tsx
import React, { useCallback } from "react";
import { Box, Typography, Chip, Paper, Grid } from "@mui/material";
import { useDropzone } from "react-dropzone";

interface ImagesStepProps {
  data: string[]; // For display (URLs/base64)
  files: File[]; // For upload
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
      // Update files for upload
      onFilesChange([...files, ...acceptedFiles]);

      // Create preview URLs for display
      const newImageUrls = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      onChange([...data, ...newImageUrls]);
    },
    [data, files, onChange, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeImage = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newData);
    onFilesChange(newFiles);
  };

  // Check if image is a URL (existing image) or blob URL (new image)
  const isExistingImage = (image: string) => {
    return image.startsWith("http") || image.startsWith("/");
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Imagini Proprietate
      </Typography>

      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: "2px dashed",
          borderColor: isDragActive ? "primary.main" : "grey.300",
          backgroundColor: isDragActive ? "action.hover" : "background.paper",
          textAlign: "center",
          cursor: "pointer",
          mb: 2,
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          {isDragActive
            ? "Drop images here..."
            : "Drag & drop images here, or click to select"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Maximum 20 images, 10MB each
        </Typography>
      </Paper>

      {/* Existing Images */}
      {data.filter((img) => isExistingImage(img)).length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Imagini existente (
            {data.filter((img) => isExistingImage(img)).length})
          </Typography>
          <Grid container spacing={1}>
            {data
              .filter((img) => isExistingImage(img))
              .map((image, index) => (
                <Grid key={index} size={3}>
                  <Box sx={{ position: "relative" }}>
                    <img
                      src={image}
                      alt={`Existing ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <Chip
                      label={`Existentă ${index + 1}`}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        backgroundColor: "rgba(0,0,0,0.7)",
                        color: "white",
                      }}
                    />
                  </Box>
                </Grid>
              ))}
          </Grid>
        </Box>
      )}

      {/* New Images */}
      {files.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Imagini noi ({files.length})
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {files.map((file, index) => (
              <Chip
                key={index}
                label={file.name}
                onDelete={() =>
                  removeImage(
                    data.findIndex((img) => !isExistingImage(img)) + index
                  )
                }
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Total Images Count */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Total imagini: {data.length} (
        {data.filter((img) => isExistingImage(img)).length} existente,{" "}
        {files.length} noi)
      </Typography>
    </Box>
  );
};
