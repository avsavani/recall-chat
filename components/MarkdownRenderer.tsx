import { FC, ReactNode } from "react"
import { useState } from 'react';
import ReactMarkdown from "react-markdown"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash"
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript"
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json"
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx"
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown"
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python"
import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss"
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx"
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript"
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import remarkGfm from "remark-gfm"
import { BiCopy } from 'react-icons/bi'
import { AiOutlineCheck } from 'react-icons/ai'

SyntaxHighlighter.registerLanguage("tsx", tsx)
SyntaxHighlighter.registerLanguage("typescript", typescript)
SyntaxHighlighter.registerLanguage("scss", scss)
SyntaxHighlighter.registerLanguage("bash", bash)
SyntaxHighlighter.registerLanguage("markdown", markdown)
SyntaxHighlighter.registerLanguage("json", json)
SyntaxHighlighter.registerLanguage("python", python)
SyntaxHighlighter.registerLanguage("javascript", javascript)
SyntaxHighlighter.registerLanguage("jsx", jsx)

const syntaxTheme = coldarkDark

const CodeBlock: React.FC<any> = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '')
  let lang = "javascript";
  if (match && match[1]) {
    lang = match[1];
  }

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    copyToClipboard(String(children).replace(/\n$/, ''));
    setCopySuccess(true);

    // After a delay, set copySuccess back to false
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  }

  return !inline && match ? (
    <div style={{ position: 'relative' }}>
      <button onClick={handleCopy} style={{ position: 'absolute', right: 0, top: 0 }}>
        {copySuccess ? <AiOutlineCheck size={18} /> : <BiCopy size={18} />}
      </button>
      <SyntaxHighlighter style={syntaxTheme} language={lang} PreTag="div" children={String(children).replace(/\n$/, '')} {...props} customStyle={{ fontSize: "14px" }} />
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function () {
  }, function (err) {
    console.error('Could not copy text: ', err);
  });
}




type Props = {
  content: string
  className?: string
  isCurrent?: boolean
}

type WithCaretProps = {
  Component: string
  children?: ReactNode
  isCurrent?: boolean
} & any

const WithStyle: FC<WithCaretProps> = ({
  isCurrent,
  Component,
  children,
  style,
  className,
  ...rest
}) => {
  // Sometimes, react-markdown sends props of incorrect type,
  // causing React errors. To be safe, we normalize them here.
  const stringifiedProps = Object.keys(rest).reduce((acc, key) => {
    const value = rest[key]
    if (value === null || typeof value === "undefined") {
      return acc
    }
    return {
      ...acc,
      key: typeof value !== "string" ? value.toString() : value,
    }
  }, {})

  return (
    <Component {...stringifiedProps} style={style} className={`markdown-node ${className}`}>
      {children}
    </Component>
  )
}

const MarkdownRenderer: React.FC<Props> = ({ content, className }) => {
  return (
    <div className={`prose prose-sm max-w-full dark:prose-invert ${className}`}>
      <ReactMarkdown
        components={{
          p: (props) => <WithStyle Component="p" {...props} style={{ fontSize: '14px' }} />,
          span: (props) => <WithStyle Component="span" {...props} />,
          h1: (props) => <WithStyle Component="h1" {...props} />,
          h2: (props) => <WithStyle Component="h2" {...props} className="text-violet-500 text-sm" />,
          h3: (props) => <WithStyle Component="h3" {...props} />,
          h4: (props) => <WithStyle Component="h4" {...props} />,
          h5: (props) => <WithStyle Component="h5" {...props} />,
          h6: (props) => <WithStyle Component="h6" {...props} />,
          pre: (props) => <WithStyle Component="pre" {...props} />,
          code: CodeBlock,
          td: (props) => <WithStyle Component="td" {...props} />,
          li: (props) => <WithStyle Component="li" {...props} />,
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}



export default MarkdownRenderer