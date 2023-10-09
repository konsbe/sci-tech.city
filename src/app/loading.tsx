import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  return (
    <div className="flex-center w-100 mrgT-5">
      <CircularProgress color="secondary" />
    </div>
  );
}
