"use client";

import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  title?: string;
  subtitle?: string;
  label?: string; // top line label
  center?: boolean; // center align or left
  bottomLine?: boolean; //  bottom line
  className?: string; // custom styling
  children?: ReactNode; // extra content (buttons etc.)
};

const HeaderStyle = ({
  title,
  subtitle,
  label,
  center = true,
  bottomLine = true,
  className,
  children,
}: Props) => {
  return (
    <div
      className={clsx(
        "w-full py-1 md:py-2",
        center ? "flex flex-col items-center text-center" : "text-left",
        className,
      )}
    >
      {/* Top Line */}
      {label && (
        <div
          className={clsx(
            "w-full max-w-5xl flex items-center gap-4",
            !center && "justify-start",
          )}
        >
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-border to-transparent" />

          <span className="text-xs md:text-sm text-muted-foreground tracking-widest uppercase whitespace-nowrap">
            {label}
          </span>

          <div className="flex-1 h-px bg-linear-to-r from-transparent via-border to-transparent" />
        </div>
      )}

      {/* Title */}
      <h1 className="mt-2 h-text font-extrabold tracking-wider bg-foreground dark:bg-linear-to-r from-foreground to-muted-foreground  bg-clip-text text-transparent">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-1 p-text  text-muted-foreground max-w-xl">
          {subtitle}
        </p>
      )}

      {/* Extra Content (Buttons etc.) */}
      {children && <div className="mt-3">{children}</div>}

      {bottomLine && (
        <div
          className={clsx(
            "w-full max-w-5xl flex items-center gap-4 mt-1",
            !center && "justify-start",
          )}
        >
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-border to-transparent" />

          <div className="flex-1 h-px bg-linear-to-r from-transparent via-border to-transparent" />

          <div className="flex-1 h-px bg-linear-to-r from-transparent via-border to-transparent" />
        </div>
      )}
    </div>
  );
};

export default HeaderStyle;
