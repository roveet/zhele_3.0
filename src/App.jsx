/**
 * 🎯 ФАЙЛ: src/App.jsx
 * 
 * ЧТО ЭТО: 
 * Главный сборочный цех сайта. Сам ничего не рендерит, а только собирает каркас.
 * 
 * ДЛЯ ЧЕГО СЛУЖИТ В НАШЕМ ПРОЕКТЕ:
 * 1. Выстраивает иерархию интерфейса.
 * 2. В будущем станет главным мостом для передачи данных.
 * 
 */
import React from 'react'
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