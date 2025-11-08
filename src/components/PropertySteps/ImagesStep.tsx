import { Delete, ZoomIn } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImagesStepProps {
  data: string[];
  files: File[];
  onChange: (_images: string[]) => void;
  onFilesChange: (_files: File[]) => void;
}

const ImagesStep = ({ data, files, onChange, onFilesChange }: ImagesStepProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
      onFilesChange([...files, ...acceptedFiles]);
      onChange([...data, ...newPreviews]);
    },
    [data, files, onChange, onFilesChange],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
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
  const isExistingImage = (src: string) => {
    return src.startsWith("http") || src.startsWith("/");
  };
  const openImage = (src: string) => {
    return window.open(src, "_blank");
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        background: isDark ? theme.palette.background.paper : theme.palette.background.default,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2} fontWeight={600}>
              Imagini proprietate
            </Typography>

            <Paper
              {...getRootProps()}
              sx={{
                p: { xs: 3, sm: 4 },
                border: "2px dashed",
                borderRadius: 3,
                borderColor: isDragActive ? theme.palette.primary.main : theme.palette.divider,
                backgroundColor: isDragActive
                  ? `${theme.palette.primary.main}11`
                  : theme.palette.background.paper,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": { borderColor: theme.palette.primary.main },
              }}
            >
              <input {...getInputProps()} />
              <Typography variant="body1" fontWeight={500}>
                {isDragActive
                  ? "Eliberează pentru a adăuga imaginile..."
                  : "Trage imaginile aici sau fă click pentru a le selecta"}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1} fontSize="0.85rem">
                Poti adauga pana la 20 imagini, max. 10MB fiecare
              </Typography>
            </Paper>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              {data.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, ml: 2 }}>
                  Nu exista imagini incarcate.
                </Typography>
              )}

              {data.map((img, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: 3,
                      "&:hover img": { transform: "scale(1.05)" },
                      "&:hover .actions": { opacity: 1 },
                    }}
                  >
                    <img
                      src={img}
                      alt={`img-${index}`}
                      style={{
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                        borderRadius: "8px",
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

                      <Tooltip title="Șterge imaginea">
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

            <Typography variant="body2" color="text.secondary" mt={2} sx={{ fontSize: "0.85rem" }}>
              Total imagini: {data.length} ({data.filter(isExistingImage).length} existente,{" "}
              {files.length} noi)
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Paper>
  );
};

export default ImagesStep;
