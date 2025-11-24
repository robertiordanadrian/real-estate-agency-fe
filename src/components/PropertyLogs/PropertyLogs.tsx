import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import { Box, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";

import type { IModificationLogEntry } from "@/common/interfaces/property/modification-log.interface";
import { IUser } from "@/common/interfaces/user/user.interface";
import { getReadableFieldLabel } from "@/common/utils/logFieldMap";
import { useAllUsersQuery } from "@/features/users/usersQueries";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";

interface PropertyLogsProps {
  logs: IModificationLogEntry[];
}

// =========
// ✅ READY
// =========
export default function PropertyLogs({ logs }: PropertyLogsProps) {
  const toast = useToast();
  const { data: allUsers = [], error } = useAllUsersQuery();

  const usersById = React.useMemo(() => {
    const map: Record<string, string> = {};

    allUsers.forEach((u: IUser) => {
      if (!u._id) return;

      map[u._id] = u.name || u.email || "User necunoscut";
    });

    return map;
  }, [allUsers]);

  useEffect(() => {
    if (error) {
      const axiosErr = error as AxiosError<{ message?: string }>;
      toast(axiosErr.response?.data?.message || "Eroare la incarcarea utilizatorilor", "error");
    }
  }, [error, toast]);

  if (!logs || logs.length === 0) {
    return (
      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        No modifications recorded.
      </Typography>
    );
  }

  return (
    <Timeline position="alternate">
      {logs.map((log) => {
        const userName = usersById[log.agentId] ?? `User ${log.agentId}`;

        return (
          <TimelineItem key={log._id}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5, opacity: 0.9 }}>
                  {new Date(log.date).toLocaleString()}
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  ✅ Modificat de: <strong>{userName}</strong>
                </Typography>

                {log.modifiedFields.map((f, idx) => {
                  const label = getReadableFieldLabel(f.fieldName);

                  return (
                    <Box key={idx} sx={{ mb: 2 }}>
                      <Typography variant="body1" fontWeight={600}>
                        {label}
                      </Typography>

                      <Typography variant="body2" sx={{ color: "error.main" }}>
                        {String(f.oldValue)}
                      </Typography>

                      <Typography variant="body2" sx={{ color: "success.main" }}>
                        {String(f.newValue)}
                      </Typography>
                    </Box>
                  );
                })}
              </Paper>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
