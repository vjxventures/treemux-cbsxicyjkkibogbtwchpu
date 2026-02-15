'use client';

import { useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

interface FlowChartProps {
  data: {
    nodes: Array<{
      id: string;
      type: string;
      label: string;
      description?: string;
      code?: string;
    }>;
    edges: Array<{
      source: string;
      target: string;
      label?: string;
    }>;
  };
}

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', ranksep: 80, nodesep: 60 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 220, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 110,
        y: nodeWithPosition.y - 40,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const nodeColors = {
  start: { bg: '#10b981', border: '#059669', text: '#ffffff' },
  end: { bg: '#ef4444', border: '#dc2626', text: '#ffffff' },
  process: { bg: '#3b82f6', border: '#2563eb', text: '#ffffff' },
  decision: { bg: '#f59e0b', border: '#d97706', text: '#ffffff' },
  loop: { bg: '#8b5cf6', border: '#7c3aed', text: '#ffffff' },
  function: { bg: '#06b6d4', border: '#0891b2', text: '#ffffff' },
  error: { bg: '#dc2626', border: '#b91c1c', text: '#ffffff' },
};

export default function FlowChart({ data }: FlowChartProps) {
  const initialNodes: Node[] = useMemo(
    () =>
      data.nodes.map((node) => {
        const colors = nodeColors[node.type as keyof typeof nodeColors] || nodeColors.process;
        return {
          id: node.id,
          type: 'default',
          position: { x: 0, y: 0 },
          data: {
            label: (
              <div className="px-3 py-2 text-center">
                <div className="font-semibold text-sm mb-1">{node.label}</div>
                {node.description && (
                  <div className="text-xs opacity-90 leading-tight">{node.description}</div>
                )}
              </div>
            ),
          },
          style: {
            background: colors.bg,
            border: `2px solid ${colors.border}`,
            borderRadius: node.type === 'decision' ? '8px' : '12px',
            color: colors.text,
            padding: 0,
            width: 220,
            minHeight: 80,
          },
        };
      }),
    [data.nodes]
  );

  const initialEdges: Edge[] = useMemo(
    () =>
      data.edges.map((edge, idx) => ({
        id: `e${edge.source}-${edge.target}-${idx}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#64748b', strokeWidth: 2 },
        labelStyle: {
          fontSize: 11,
          fill: '#475569',
          fontWeight: 600,
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.9,
        },
      })),
    [data.edges]
  );

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(initialNodes, initialEdges),
    [initialNodes, initialEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  useEffect(() => {
    const { nodes: newLayoutedNodes, edges: newLayoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );
    setNodes(newLayoutedNodes);
    setEdges(newLayoutedEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      attributionPosition="bottom-left"
      minZoom={0.2}
      maxZoom={1.5}
    >
      <Background color="#e2e8f0" gap={16} />
      <Controls />
      <MiniMap
        nodeColor={(node) => {
          const nodeType = data.nodes.find((n) => n.id === node.id)?.type || 'process';
          return nodeColors[nodeType as keyof typeof nodeColors]?.bg || nodeColors.process.bg;
        }}
        maskColor="#f1f5f966"
      />
    </ReactFlow>
  );
}
