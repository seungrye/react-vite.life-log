import Markdown from "react-markdown"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"

export function MarkView(props: { content: string }) {
  const { content } = props;
  return <Markdown
    className={"markview"}
    children={content}
    remarkPlugins={[remarkGfm]}
    components={{
      code(props) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { children, className, node, ref, ...rest } = props

        const match = /language-(\w+)/.exec(className || '')
        const codes = String(children)
        const multiLine = codes.indexOf('\n') > -1

        return (
          <SyntaxHighlighter
            {...rest}
            PreTag={multiLine ? "div" : "span"}
            children={codes.replace(/\n$/, '')}
            language={match?.[1] || "text"}
            style={multiLine ? vscDarkPlus : {}}
            customStyle={{ margin: "auto", background: "unset", lineBreak: "anywhere" }}
            wrapLines={true}
            wrapLongLines={true}
          />
        )
      }
    }}
  />
}
