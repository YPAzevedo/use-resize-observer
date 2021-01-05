import React from "react";
import ResizeObserver from "resize-observer-polyfill";
import "./styles.css";

function useResizeObserver() {
  const [, rerender] = React.useReducer(() => []);
  const nodeRef = React.useRef(null);
  const [entry, setEntry] = React.useState({});

  const [resizeObserver] = React.useState(
    () => new ResizeObserver(([entry]) => setEntry(entry))
  );

  const node = nodeRef.current;
  React.useLayoutEffect(() => {
    // Update position of element on window resize
    const _node = node || nodeRef.current;
    const handleWindowResize = () => setEntry(_node.getBoundingClientRect());
    if (_node) window.addEventListener("resize", handleWindowResize);
    return () => {
      if (_node) window.removeEventListener("resize", handleWindowResize);
    };
  }, [node]);

  React.useLayoutEffect(() => {
    const _node = node || nodeRef.current;
    if (_node) resizeObserver.observe(_node);
    return () => {
      if (_node) {
        resizeObserver.disconnect();
      }
    };
  }, [resizeObserver, node]);

  return [
    entry,
    nodeRef,
    (el) => {
      nodeRef.current = el;
      rerender();
    }
  ];
}

export default function App() {
  const [entry, ref, updateAnchor] = useResizeObserver();

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
        ref={ref}
        onMouseEnter={(e) => updateAnchor(e.target)}
        readOnly
        value={JSON.stringify(rect, null, 2)}
      />
    </div>
  );
}
