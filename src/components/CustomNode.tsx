'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const CustomNode = memo(({ data }: NodeProps) => {
  return (
    <div className="relative px-4 py-3 rounded-lg shadow-lg border-2 transition-all hover:shadow-xl hover:scale-105">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="text-center">
        <div className="font-semibold text-sm mb-1 leading-tight">{data.label}</div>
        {data.description && (
          <div className="text-xs opacity-90 leading-snug mt-1">{data.description}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
