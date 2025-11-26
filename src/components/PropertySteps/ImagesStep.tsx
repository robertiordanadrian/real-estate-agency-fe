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
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImagesStepProps {
  data: string[];
  files: File[];
  onChange: (_images: string[]) => void;
  onFilesChange: (_files: File[]) => void;
  onRemoveExistingImage?: (_url: string) => void;
}

// =========
// ✅ READY
// =========
const ImagesStep = ({
  data,
  files,
  onChange,
  onFilesChange,
  onRemoveExistingImage,
}: ImagesStepProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleReorder = (from: number, to: number) => {
    if (from === to || from === null) return;

    const reordered = [...data];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    onChange(reordered);

    const existingImages = reordered.filter((src) => isExistingImage(src));
    const newImages = reordered.filter((src) => !isExistingImage(src));

    const newFilesOrdered: File[] = [];

    newImages.forEach((newImgUrl) => {
      const indexInOld = data.indexOf(newImgUrl);
      const fileIndex = indexInOld - existingImages.length;

      if (fileIndex >= 0 && fileIndex < files.length) {
        newFilesOrdered.push(files[fileIndex]);
      }
    });

    onFilesChange(newFilesOrdered);
  };

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
    maxFiles: 30,
    maxSize: 10 * 1024 * 1024,
  });

  const handleRemove = (index: number) => {
    const url = data[index];
    if (isExistingImage(url)) {
      onRemoveExistingImage && onRemoveExistingImage(url);
    }
    const newData = data.filter((_, i) => i !== index);
    const newFiles: File[] = [];
    newData.forEach((img) => {
      if (!isExistingImage(img)) {
        const fileIndex = data.indexOf(img) - data.filter(isExistingImage).length;
        if (fileIndex >= 0 && fileIndex < files.length) {
          newFiles.push(files[fileIndex]);
        }
      }
    });
    if (newData.length === 0) {
      onChange([]);
      onFilesChange([]);
      return;
    }
    onChange(newData);
    onFilesChange(newFiles);
  };

  const isExistingImage = (src: string) => {
    return src.startsWith("http") && !src.startsWith("blob:");
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
                    draggable
                    onDragStart={(e) => {
                      setDragIndex(index);
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", index.toString());
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragIndex !== null) {
                        handleReorder(dragIndex, index);
                      }
                      setDragIndex(null);
                    }}
                    sx={{
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: 3,
                      cursor: "grab",
                      opacity: dragIndex === index ? 0.4 : 1,
                      transition: "opacity 0.2s ease",
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
                      onClick={() => openImage(img)}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            openImage(img);
                          }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(index);
                          }}
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
