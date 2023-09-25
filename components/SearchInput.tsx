import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import Textarea from 'react-textarea-autosize';
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from '@/components/shadui/button'
import { SearchProps } from '@/types';
import { SearchInputHelpers } from './SearchInputHelpers';
import { useStore } from "@/lib/globalState";

export function SearchInput({
  value,
  textareaRef,
  handleChange,
  handleClick,
  isLoading,
}: SearchProps) {
  const [logoVisible, setLogoVisible] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const { onButtonClick } = SearchInputHelpers();
  const { loadingStatus, setLoadingStatus } = useStore();


  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey && loadingStatus !== "loading") {
      e.preventDefault();
      handleClickWithStateUpdate(e);
    }
  }

  const handleChangeInternal = (e) => {
    handleChange(e);
    setCharCount(e.target.value.length);
  };

  const handleClickWithStateUpdate = (event) => {
    handleClick(event);
    setLogoVisible(false);
  };

  useEffect(() => {
    if (!value) {
      let event = new Event('input', { bubbles: true });
      textareaRef.current?.dispatchEvent(event);
    }
  }, [value]);

  return (
    <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            disabled={loadingStatus === "loading"}
            onClick={onButtonClick}
            className={cn(
              'absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4'
            )}
          >
            <IconPlus />
            <span className="sr-only">New Chat</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>New Chat</TooltipContent>
      </Tooltip>


      <Textarea
        ref={textareaRef}
        value={value}
        className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        spellCheck={false}
        placeholder="Send a message."
        rows={1}
        data-gramm="false"
        onChange={handleChangeInternal}
        onKeyDown={handleKeyDown}
      />
      {charCount > 3000 && (
        <div
          className={`${charCount > 12000 ? 'text-red-600' : 'text-gray-600'}`}
          style={{ position: 'absolute', bottom: 10, right: 10, fontSize: '0.25rem' }}
        >
          {charCount > 12000
            ? `Character limit exceeded! Current count is ${charCount}/12000. Message will be truncated.`
            : `Character count: ${charCount}/12000.`}
        </div>
      )}

      <motion.button
        animate={loadingStatus}
        initial={loadingStatus}
        disabled={loadingStatus === "loading"}
        type="submit"
        onClick={handleClick}
        className={cn(
          "absolute right-0 top-5 sm:right-4"
        )}
      >
        <AnimatePresence>
          {loadingStatus === 'loading' ? (
            <Icons.loading className="-ml-0.5 h-5 w-5 animate-spin text-black-500/80 group-hover:text-black-500 dark:text-black-400 dark:group-hover:text-black-300" />
          ) : loadingStatus === "typing" || loadingStatus === "idle" ? (
            <IconArrowElbow className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          ) : (
            <IconArrowElbow className="-ml-0.5 h-5 w-5" />
          )}
        </AnimatePresence>
      </motion.button>
    </div>

  );

}

