/**
 * 🎯 ФАЙЛ: src/main.jsx (или Main.jsx)
 * * ЧТО ЭТО: 
 * Главная точка входа во всё веб-приложение. Самый первый файл, который запускает браузер.
 * * ДЛЯ ЧЕГО СЛУЖИТ В НАШЕМ ПРОЕКТЕ:
 * 1. Находит в "тупом" HTML-файле (`index.html`) пустой контейнер <div id="root">.
 * 2. Буквально "вживляет" (рендерит) туда наше React-приложение, начиная с корневого компонента <App />.
 * 3. Подключает файл глобальных стилей `index.css`, чтобы они применились ко всему сайту.
 * 4. Обертка <React.StrictMode> активирует строгий режим разработки (помогает ловить баги в консоли).
 * * ВЕРДИКТ: 
 * Файл неприкосновенен. Объединять или переносить нельзя — сборщик Vite ищет его строго по этому пути.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
