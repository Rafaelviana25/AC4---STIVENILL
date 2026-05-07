@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

:root {
  --sat: env(safe-area-inset-top, 0px);
}

@layer utilities {
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes pulseGreenWhite {
  0%, 100% { background-color: #a3e635; }
  50% { background-color: #ffffff; }
}

.animate-pulse-green-white {
  animation: pulseGreenWhite 2s infinite ease-in-out;
}

@keyframes pulseGreenOverlay {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.6; }
}

.animate-pulse-green-overlay {
  animation: pulseGreenOverlay 2s infinite ease-in-out;
}

/* Global Selection Style */
::selection {
  background-color: #a3e635; /* lime-400 */
  color: #0f172a; /* slate-900 */
}

/* Global Reset & Mobile Optimization */
* {
  -webkit-tap-highlight-color: transparent;
}

body {
  overscroll-behavior-y: contain;
  background-color: #020617; /* slate-950 */
}

/* Global Scrollbar (Fallback) */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #1e293b; /* slate-800 */
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155; /* slate-700 */
}
