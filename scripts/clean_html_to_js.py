import re
import html as ihtml
from pathlib import Path

root = Path(__file__).resolve().parents[1]
index_path = root / 'index.html'
out_path = root / 'game.js'

src = index_path.read_text(encoding='utf-8')

# Remove any real <script> tag contents to avoid matching our bootstrap script
src = re.sub(r'<script[\s\S]*?</script>', '', src, flags=re.IGNORECASE)

text = re.sub(r'<[^>]+>', '', src)
text = ihtml.unescape(text)

start_candidates = [
    "const canvas = document.getElementById('gameCanvas');",
    'const STATE'
]
positions = [text.find(s) for s in start_candidates]
positions = [p for p in positions if p != -1]
positions.sort()
start_idx = positions[0] if positions else -1
if start_idx == -1:
    start_idx = 0

end_candidates = [
    'requestAnimationFrame(loop);'
]
end_idx = -1
for e in end_candidates:
    j = text.rfind(e)
    if j != -1:
        end_idx = j + len(e)
        break
if end_idx == -1:
    end_idx = len(text)

js = text[start_idx:end_idx]

clean = js.replace('\r', '')
clean = '\n'.join([line.rstrip() for line in clean.split('\n')])

out_path.write_text(clean.strip() + '\n', encoding='utf-8')

print('Extracted JS length:', len(clean))
print('Written to', out_path)
