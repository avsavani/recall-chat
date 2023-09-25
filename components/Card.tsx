import { useState } from "react";
import { cn } from "@/lib/utils";


export const CardHeader = ({ children }) => <div>{children}</div>;

export const CardTitle = ({ children }) => (
  <h2 className="flex-none px-4 text-xl font-semibold text-neutral-900 dark:text-white md:px-8 md:text-3xl">
    {children}
  </h2>
);

export const CardDescription = ({ children }) => (
  <div className="px-4 md:px-8">
    <p className="my-2 text-center text-base text-neutral-800 dark:text-neutral-100 md:text-lg">
      {children}
    </p>
  </div>
);

export const CardContent = ({ children }) => (
  <div className="mx-3 mt-2 px-3 backdrop-blur-none">{children}</div>
);

export const CardFooter = ({ children }) => <div>{children}</div>;

export const Card = ({ children }) => {
  const [highlight, setHighlight] = useState(false);

  return (

    <div
      onMouseEnter={() => setHighlight(true)}
      onMouseLeave={() => setHighlight(false)}
      className={cn(
        "flex min-h-[350px] w-full flex-col items-center rounded-3xl pt-7 md:w-full",
        "bg-transparent ring-inset ring-indigo-400/25 backdrop-blur dark:border-black-500/50 dark:bg-neutral-800/30 ",
        {
          "border border-neutral-900/50 shadow-lg transition duration-150 dark:border-neutral-500/30 ":
            !highlight,
          "shadow-box border border-black-900/30 transition duration-150 ":
            highlight,
        }
      )}
      style={{ backgroundColor: 'hsl(var(--card-foreground)) var(--card)' }}
    >
      {children}
    </div>


  );
};
