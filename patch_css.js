const fs = require('fs');
const file = 'app/globals.css';
const content = fs.readFileSync(file, 'utf8');

const newCss = `/* Global Ambient Brush Trail */
.mouse-follow-container {
  pointer-events: none;
  z-index: 0;
}

.glow-particle {
  position: absolute;
  top: 0;
  left: 0;
  width: 320px;
  height: 320px;
  margin-left: -160px;
  margin-top: -160px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(34, 211, 238, 0.05) 0%,
    rgba(139, 92, 246, 0.025) 40%,
    transparent 70%
  );
  mix-blend-mode: screen;
  will-change: transform, opacity;
  opacity: 0;
}

@media (hover: none) and (pointer: coarse) {
  .mouse-follow-container {
    display: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mouse-follow-container {
    display: none !important;
  }
}
`;

const lines = content.split('\n');
const index = lines.findIndex(l => l.includes('/* Global Mouse Follow Glow */'));
if (index !== -1) {
    const updatedContent = lines.slice(0, index).join('\n') + '\n' + newCss;
    fs.writeFileSync(file, updatedContent);
}
