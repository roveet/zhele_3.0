import { useState } from 'react';
import Header from './components/ui/Header';
import Scene3D from './components/scene/Scene3D';
import OverlayContent from './components/ui/OverlayContent';
import TransformationControls from './components/ui/TransformationControls';

export default function App() {
  const [transformProgress, setTransformProgress] = useState(0);

  return (
    <>
      <Scene3D
        transformProgress={transformProgress}
      />

      <div className="ui-layer">
        <Header />
        <OverlayContent />

        <TransformationControls
          value={transformProgress}
          onChange={setTransformProgress}
        />
      </div>
    </>
  );
}