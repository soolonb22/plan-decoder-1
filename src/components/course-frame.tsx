export function CourseFrame({ title, html }: { title: string; html: string }) {
  return (
    <iframe
      title={title}
      srcDoc={html}
      className="min-h-0 w-full flex-1 border-0 bg-paper"
      sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-popups-to-escape-sandbox allow-presentation allow-downloads"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
