import React from "react";

export default function SubZeroLogo({ className = "h-10 w-10" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Dark Navy Background within Rotated Rounded Diamond */}
      <rect
        x="50"
        y="8"
        width="58"
        height="58"
        rx="13"
        transform="rotate(45 50 8)"
        fill="#070c1e"
        stroke="#4da2ff"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* Stylized 'S' Monogram in Light Blue */}
      <g fill="#4da2ff">
        {/* Top Arm with Round Terminal Knob and Wing */}
        <path
          d="M 52 23
             C 48.5 23 45.8 25.7 45.8 29.2
             C 45.8 32.7 48.5 35.4 52 35.4
             C 56.5 35.4 60.5 37 64 40
             C 67.5 43 70 47 70.5 51.5
             L 76.5 45.5
             C 76.5 41 73.5 35.5 68.5 30.5
             L 61 23
             Z"
        />
        {/* Bottom Arm with Round Terminal Knob and Wing */}
        <path
          d="M 48 77
             C 51.5 77 54.2 74.3 54.2 70.8
             C 54.2 67.3 51.5 64.6 48 64.6
             C 43.5 64.6 39.5 63 36 60
             C 32.5 57 30 53 29.5 48.5
             L 23.5 54.5
             C 23.5 59 26.5 64.5 31.5 69.5
             L 39 77
             Z"
        />
        {/* Top Main Fluid Ribbon */}
        <path
          d="M 52 23
             C 48.5 23 45.8 25.7 45.8 29.2
             C 45.8 32.7 48.5 35.4 52 35.4
             C 57 35.4 62 38 66 42
             L 73.5 34.5
             C 67.5 27 60 23 52 23 Z"
        />
        {/* Bottom Main Fluid Ribbon */}
        <path
          d="M 48 77
             C 51.5 77 54.2 74.3 54.2 70.8
             C 54.2 67.3 51.5 64.6 48 64.6
             C 43 64.6 38 62 34 58
             L 26.5 65.5
             C 32.5 73 40 77 48 77 Z"
        />
        {/* Central S-Curve Flow (Upper & Lower Wings into Spine) */}
        <path
          d="M 73.5 34.5
             L 66 42
             C 58 48 48 53 38 57
             L 30.5 61.5
             L 29.5 55.5
             C 38 50 49 44.5 58 38.5
             L 67 31
             Z"
        />
        <path
          d="M 26.5 65.5
             L 34 58
             C 42 52 52 47 62 43
             L 69.5 38.5
             L 70.5 44.5
             C 62 50 51 55.5 42 61.5
             L 33 69
             Z"
        />
      </g>
    </svg>
  );
}
