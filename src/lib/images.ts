// Content files name their images by file name, without the extension
// (`image: cardamom-bun`), so replacing a photo is just dropping a new file
// with the same name into src/assets/images/ — any of jpg, png, webp.
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/images/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

const byName = new Map(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop()!.replace(/\.[^.]+$/, ''), mod.default]),
);

export function image(name: string): ImageMetadata {
  const found = byName.get(name);
  if (!found) {
    throw new Error(
      `Image "${name}" not found in src/assets/images/. Available: ${[...byName.keys()].sort().join(', ')}`,
    );
  }
  return found;
}
