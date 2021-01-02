import React from "react";
import ResizeObserver from "resize-observer-polyfill";
import "./styles.css";

function useResizeObserver() {
  const [node, setNode] = React.useState(null);
  const [entry, setEntry] = React.useState({});

  const [resizeObserver] = React.useState(
    () => new ResizeObserver(([entry]) => setEntry(entry))
  );

  const bindObserver = { ref: setNode };

  React.useLayoutEffect(() => {
    // Update position of element on window resize
    const handleWindowResize = () => setEntry(node.getBoundingClientRect());
    if (node) window.addEventListener("resize", handleWindowResize);
    return () => {
      if (node) window.removeEventListener("resize", handleWindowResize);
    };
  }, [node]);

  React.useLayoutEffect(() => {
    if (node) resizeObserver.observe(node);
    return () => {
      if (node) {
        resizeObserver.disconnect();
      }
    };
  }, [resizeObserver, node]);

  return [entry, bindObserver, setNode];
}

export default function App() {
  const [entry, bindObserver, updateAnchor] = useResizeObserver();

  const rect = entry.target?.getBoundingClientRect() || {};

  return (
    <div className="App">
      <div
        style={{
          background: "orange",
          borderRadius: "50%",
          width: 50,
          height: 50,
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate(${rect.left + rect.width / 2 - 25}px, ${
            rect.top + rect.height / 2 - 25
          }px)`
        }}
      />
      <h1 onMouseEnter={(e) => updateAnchor(e.target)}>useResizeObserver</h1>
      <span role="img" aria-label="click">
        👆🏼 Mouse over the title
      </span>
      <h2>Resize the textarea or window</h2>
      <textarea
        {...bindObserver}
        onMouseEnter={(e) => updateAnchor(e.target)}
        readOnly
        value={JSON.stringify(rect, null, 2)}
      />
    </div>
  );
}
