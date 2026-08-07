// A deliberately small renderer — enough for prose chapters (paragraphs,
// bold, italic, line breaks). If you need richer formatting later (embedded
// images, links), swap this for @payloadcms/richtext-lexical/react's
// <RichText> component, which supports the full node set.

function renderTextNode(node: any, key: number) {
  let el: React.ReactNode = node.text
  if (node.format & 1) el = <strong key={key}>{el}</strong> // bold
  if (node.format & 2) el = <em key={key}>{el}</em> // italic
  return <span key={key}>{el}</span>
}

function renderNode(node: any, key: number): React.ReactNode {
  if (node.type === 'text') return renderTextNode(node, key)

  const children = node.children?.map((child: any, i: number) => renderNode(child, i)) ?? null

  switch (node.type) {
    case 'paragraph':
      return (
        <p key={key} className="text-sm leading-relaxed mb-4">
          {children}
        </p>
      )
    case 'linebreak':
      return <br key={key} />
    default:
      return <span key={key}>{children}</span>
  }
}

export function ChapterBody({ content }: { content: any }) {
  const root = content?.root
  if (!root?.children) return <p className="text-sm text-ink-muted">This chapter has no content yet.</p>
  return <>{root.children.map((node: any, i: number) => renderNode(node, i))}</>
}
