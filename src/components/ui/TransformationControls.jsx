export default function TransformationControls({
  value,
  onChange
}) {
  return (
    <div className="transform-controls">

      <div className="transform-controls__title">
        Transform
      </div>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) =>
          onChange(
            parseFloat(e.target.value)
          )
        }
      />

    </div>
  );
}