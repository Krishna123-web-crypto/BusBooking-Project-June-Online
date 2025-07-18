import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { Typography, Paper } from "@mui/material";
export default function BusTimeline({ stops }) {
  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
      <Timeline position="right">
        {stops.map((stop, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent
              sx={{ flex: 0.2, fontSize: "0.9rem", color: "gray" }}
            >
              {stop.time}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              {index < stops.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent sx={{ py: "6px", px: 2 }}>
              <Typography variant="body1" fontWeight={500}>
                {stop.stop}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Paper>
  );
}
