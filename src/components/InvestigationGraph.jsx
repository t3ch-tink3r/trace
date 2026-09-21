import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
  formatSignalType,
  formatRelationshipType,
  formatEvidenceType,
} from "../utils";

function InvestigationGraph({
  signals,
  evidence,
  relationships,
}) {
  const nodes = [
    ...signals.map((signal, index) => ({
      id: signal.type,
      position: {
        x: 80 + (index % 2) * 330,
        y: 60 + Math.floor(index / 2) * 180,
      },
      data: {
        label: (
          <div className="trace-flow-node">
            <span className="flow-kind">
              SIGNAL
            </span>

            <strong>
              {formatSignalType(signal.type)}
            </strong>

            <small>
              {signal.description}
            </small>
          </div>
        ),
      },
      type: "default",
    })),

    ...evidence.map((item, index) => ({
      id: item.id,
      position: {
        x: 80 + (index % 2) * 330,
        y: 430 + Math.floor(index / 2) * 180,
      },
      data: {
        label: (
          <div className="trace-flow-node">
            <span className="flow-kind">
              EVIDENCE
            </span>

            <strong>
              {formatEvidenceType(item.type)}
            </strong>

            <small>{item.value}</small>
          </div>
        ),
      },
      type: "default",
    })),
  ];

  const edges = relationships.map(
    (relationship, index) => ({
      id: `relationship-${index}`,
      source: relationship.from,
      target: relationship.to,
      label: formatRelationshipType(
        relationship.type
      ),
      style: {
        strokeWidth: 1.5,
      },
      labelStyle: {
        fontSize: 9,
      },
    })
  );

  return (
    <div className="graph">
      <div className="graph-header">
        <div>
          <span className="graph-eyebrow">
            CORRELATION
          </span>

          <h3>
            Evidence relationship map
          </h3>
        </div>

        <span className="graph-count">
          {nodes.length} nodes · {edges.length} relationships
        </span>
      </div>

      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{
            padding: 0.25,
          }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnDoubleClick={false}
          attributionPosition="bottom-right"
        >
          <Background gap={24} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}

export default InvestigationGraph;