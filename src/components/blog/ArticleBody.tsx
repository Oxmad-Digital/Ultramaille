import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import sanitizeHtml from "sanitize-html";

// Le contenu vient de l'éditeur admin (HTML Tiptap) ou d'anciens articles en
// Markdown. Dans les deux cas il est filtré ici, côté serveur, avant d'être
// rendu : un compte "member" ne doit pas pouvoir injecter de script dans
// une page vue par un admin.

const COLOR_STYLE = [
  /^#[0-9a-f]{3,8}$/i,
  /^rgba?\(\s*[\d.]+%?\s*(,\s*[\d.]+%?\s*){2,3}\)$/i,
  /^hsla?\(\s*[\d.]+(deg)?\s*(,\s*[\d.]+%?\s*){2,3}\)$/i,
];
const SIZE_STYLE = [/^\d+(\.\d+)?(px|%)$/];

const HTML_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6",
    "strong", "b", "em", "i", "u", "s", "del", "sub", "sup", "code", "pre", "blockquote",
    "ul", "ol", "li", "a", "img", "mark", "span", "div", "figure", "figcaption",
    "table", "colgroup", "col", "thead", "tbody", "tfoot", "tr", "th", "td",
    "iframe",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel", "title"],
    img: ["src", "alt", "title", "width", "height"],
    span: ["style"],
    mark: ["style", "data-color"],
    div: ["class", "data-youtube-video"],
    code: ["class"],
    table: ["style"],
    col: ["style", "span"],
    th: ["colspan", "rowspan", "data-colwidth"],
    td: ["colspan", "rowspan", "data-colwidth"],
    iframe: ["src", "width", "height", "allow", "allowfullscreen", "frameborder", "title"],
  },
  allowedClasses: {
    div: ["video-embed", "tableWrapper"],
    code: ["language-*"],
  },
  allowedStyles: {
    span: { color: COLOR_STYLE },
    mark: { "background-color": COLOR_STYLE },
    table: { width: SIZE_STYLE, "min-width": SIZE_STYLE },
    col: { width: SIZE_STYLE, "min-width": SIZE_STYLE },
  },
  allowedSchemes: ["https", "http", "mailto", "tel"],
  allowedSchemesByTag: { img: ["https"] },
  allowProtocolRelative: false,
  allowedIframeHostnames: ["www.youtube-nocookie.com", "www.youtube.com"],
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: attribs.target === "_blank" ? { ...attribs, rel: "noopener noreferrer" } : attribs,
    }),
  },
};

export default function ArticleBody({ content }: { content: string }) {
  if (/^\s*</.test(content)) {
    return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content, HTML_OPTIONS) }} />;
  }

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
      {content}
    </ReactMarkdown>
  );
}
