import { useState } from "react";

import { CheckCircleIcon, CopyIcon } from "@phosphor-icons/react";

import { Button, type ButtonProps } from "./ui/button";

export const CopyButton = ({
  text,
  ...props
}: { text: string } & ButtonProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Button
      onClick={() => copyToClipboard(text)}
      size="icon-sm"
      variant="ghost"
      {...props}
    >
      {!copied ? (
        <CopyIcon className="size-4" />
      ) : (
        <CheckCircleIcon className="size-4" />
      )}
    </Button>
  );
};
