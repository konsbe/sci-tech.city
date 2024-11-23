"use client";
import React from "react";
import {
  useDroppable,
} from "@dnd-kit/core";
import { ColumnType } from "./types";

export default function Placeholder({ field }: { field: ColumnType }) {
    const { setNodeRef, isOver } = useDroppable({
      id: `${field}-placeholder`,
    });
  
    return (
      <div
        id={`${field}-placeholder`}
        ref={setNodeRef}
        className={`placeholder ${isOver ? "highlight-droppable" : ""}`}>
        This list is empty
      </div>
    );
  }