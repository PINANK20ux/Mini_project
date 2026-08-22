import React from "react";
import { CATEGORIES } from "../constants/categories.js";

export default function Badge({ category }) {
  const c = CATEGORIES[category] || CATEGORIES.Work;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:scale-105 cursor-default select-none ${c.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full transition-transform duration-200 group-hover:scale-125 ${c.dot}`} />
      {category}
    </span>
  );
}

