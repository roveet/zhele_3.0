import React from 'react'
// Меняем пути с ./layout/ и ./components/ на точное расположение внутри src/components/
import Header from './components/Header';
import Scene3D from './components/Scene3D';
import Sections from './components/Sections';

export default function App() {
  return (
    <>
      <Header />
      <Scene3D />
      <Sections />
    </>
  );
}