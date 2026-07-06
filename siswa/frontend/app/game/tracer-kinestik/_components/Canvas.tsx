'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CanvasProps } from '../../../types';

export default function Canvas({
  selectedLetter,
  points,
  currentPointIndex,
  setCurrentPointIndex,
  completedSegments,
  setCompletedSegments,
  onComplete
}: CanvasProps) {
  const [isTracingActive, setIsTracingActive] = useState(false);
  const [drawPoints, setDrawPoints] = useState<Array<{ x: number; y: number }>>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  // Reset drawing local path if letter changes
  useEffect(() => {
    setIsTracingActive(false);
    setDrawPoints([]);
  }, [selectedLetter]);

  // Helper: compute coordinates relative to 300x300 viewBox
  const getCoords = (
    e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>
  ): { x: number; y: number } | null => {
    if (!svgRef.current) return null;

    const rect = svgRef.current.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) {
        // For touch end, use changedTouches if available
        if (e.changedTouches && e.changedTouches.length > 0) {
          clientX = e.changedTouches[0].clientX;
          clientY = e.changedTouches[0].clientY;
        } else {
          return null;
        }
      } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * 300;
    const y = ((clientY - rect.top) / rect.height) * 300;

    return { x, y };
  };

  // Distance helper
  const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  // Start touch or mouse drag
  const handleStart = (
    e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>
  ) => {
    e.preventDefault();
    const coords = getCoords(e);
    if (!coords) return;

    // The active start point is always points[currentPointIndex - 1]
    // (currentPointIndex starts at 1, so this is always points[0] for a fresh letter,
    // or the last completed point when resuming mid-letter)
    const activeStartPoint = points[currentPointIndex - 1];
    if (!activeStartPoint) return;

    const dist = getDistance(coords, activeStartPoint);
    const startThreshold = 35; // Larger threshold for easy child interaction

    if (dist <= startThreshold) {
      setIsTracingActive(true);
      setDrawPoints([activeStartPoint, coords]);
    }
  };

  // Dragging mouse or touch
  const handleMove = (
    e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>
  ) => {
    if (!isTracingActive) return;
    e.preventDefault();

    const coords = getCoords(e);
    if (!coords) return;

    // Add current point to the drawn path for visual feedback
    setDrawPoints((prev) => [...prev, coords]);

    // Check if we hit the current target point
    const targetPoint = points[currentPointIndex];
    if (!targetPoint) return;

    const dist = getDistance(coords, targetPoint);
    const hitThreshold = 30; // Child-friendly target size

    if (dist <= hitThreshold) {
      // Completed the segment!
      const startPoint = points[currentPointIndex - 1];
      if (!startPoint) return; // Safety guard (should not happen when index starts at 1)
      const newSegment = {
        x1: startPoint.x,
        y1: startPoint.y,
        x2: targetPoint.x,
        y2: targetPoint.y
      };

      setCompletedSegments((prev) => [...prev, newSegment]);

      // Move to next point
      const nextIndex = currentPointIndex + 1;
      setCurrentPointIndex(nextIndex);

      // Check if letter completed
      if (nextIndex >= points.length) {
        setIsTracingActive(false);
        setDrawPoints([]);
        onComplete();
      } else {
        // Reset current drawing path starting from the new anchor
        setDrawPoints([targetPoint, coords]);
      }
    }
  };

  // Stop drawing
  const handleEnd = () => {
    setIsTracingActive(false);
    setDrawPoints([]);
  };

  // Build the complete template path string (dashed line in bg)
  const buildTemplatePath = () => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  };

  // Build current drawing path string
  const buildCurrentPath = () => {
    if (drawPoints.length === 0) return '';
    let d = `M ${drawPoints[0].x} ${drawPoints[0].y}`;
    for (let i = 1; i < drawPoints.length; i++) {
      d += ` L ${drawPoints[i].x} ${drawPoints[i].y}`;
    }
    return d;
  };

  const templatePathD = buildTemplatePath();
  const currentPathD = buildCurrentPath();

  return (
    <div className="w-full flex items-center justify-center p-2 bg-slate-50/50 rounded-2xl border border-slate-100/85">
      <svg
        ref={svgRef}
        viewBox="0 0 300 300"
        className="w-full max-w-[280px] h-[280px] select-none touch-none bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <defs>
          {/* Arrowhead marker definition */}
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
          </marker>
        </defs>

        {/* Faint Guide Template Path */}
        {templatePathD && (
          <>
            {/* Outer shadow template */}
            <path
              d={templatePathD}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner dashed line template */}
            <path
              d={templatePathD}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 8"
            />
          </>
        )}

        {/* Direction Guide Arrow for Active Segment */}
        {currentPointIndex > 0 && currentPointIndex < points.length && !isTracingActive && (
          <line
            x1={points[currentPointIndex - 1].x}
            y1={points[currentPointIndex - 1].y}
            x2={points[currentPointIndex].x}
            y2={points[currentPointIndex].y}
            stroke="#6366f1"
            strokeWidth="3"
            strokeDasharray="5 5"
            markerEnd="url(#arrow)"
            className="animate-pulse"
          />
        )}

        {/* Completed Green Segments */}
        {completedSegments.map((seg, idx) => (
          <g key={idx}>
            {/* Outer thick green line */}
            <line
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke="#34d399"
              strokeWidth="16"
              strokeLinecap="round"
              className="opacity-70"
            />
            {/* Inner solid green line */}
            <line
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke="#059669"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* Live Finger Drawing Path (Blue) */}
        {isTracingActive && currentPathD && (
          <path
            d={currentPathD}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          />
        )}

        {/* Guide Dots */}
        {points.map((pt, idx) => {
          const isCompleted = idx < currentPointIndex;
          const isActive = idx === currentPointIndex;
          const isStart = idx === 0;

          if (isCompleted) {
            // Checked/Done points
            return (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r="7"
                fill="#059669"
                stroke="white"
                strokeWidth="1.5"
              />
            );
          }

          if (isActive) {
            // Pulsing target point
            return (
              <g key={idx}>
                {/* Pulse background */}
                <circle cx={pt.x} cy={pt.y} r="14" fill="#6366f1" opacity="0.3">
                  <animate
                    attributeName="r"
                    values="8;16;8"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.6;0.1;0.6"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Core target */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="7.5"
                  fill="#4f46e5"
                  stroke="white"
                  strokeWidth="2"
                />
              </g>
            );
          }

          // Future/Inactive points
          return (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              fill={isStart ? '#10b981' : '#94a3b8'}
              stroke="white"
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </div>
  );
}
