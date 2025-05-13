import { ExhaustiveError } from "@/utils/errors";
import clsx from "clsx";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

///////////////////
// size

type Size = "sm" | "lg";

const DEFAULT_SIZE: Size = "sm";

const sizeToClassNameMaps: Record<Size, string> = {
  sm: "btn-sm",
  lg: "btn-lg",
};

///////////////////
// color

export type Color = "primary" | "secondary" | "info" | "success" | "warning" | "danger";

const DEFAULT_COLOR: Color = "primary";

///////////////////
// variant

type Variant = "filled" | "outline";

const DEFAULT_VARIANT: Variant = "outline";

//////////////////////

const generateClassNameFromVariantAndColor = (variant: Variant, color: Color) => {
  const variantMaps: Record<Variant, string> = {
    filled: "btn-",
    outline: "btn-outline-",
  };

  const colorMaps: Record<Color, string> = {
    primary: "primary",
    secondary: "secondary",
    info: "info",
    success: "success",
    warning: "warning",
    danger: "danger",
  };

  return variantMaps[variant] + colorMaps[color];
};

type CommonProps = {
  size?: Size;
  color?: Color;
  variant?: Variant;
};

///////////////////
// button pattern

type ButtonProps = ComponentPropsWithoutRef<"button"> &
  CommonProps & {
    component: "button";
  };

const ButtonAsButtonTag = ({
  className,
  children,
  size = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  variant = DEFAULT_VARIANT,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        "btn",
        sizeToClassNameMaps[size],
        generateClassNameFromVariantAndColor(variant, color),
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

///////////////////
// anchor pattern

type AnchorProps = ComponentPropsWithoutRef<"a"> &
  CommonProps & {
    href: string;
    component: "a";
  };

const ButtonAsAnchorTag = ({
  className,
  children,
  size = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  variant = DEFAULT_VARIANT,
  ...rest
}: AnchorProps) => {
  return (
    <Link
      className={clsx(
        "btn",
        sizeToClassNameMaps[size],
        generateClassNameFromVariantAndColor(variant, color),
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
};

//////////////////////

type Props = ButtonProps | AnchorProps;

export const Button = (props: Props) => {
  const componentType = props.component;

  switch (componentType) {
    case "button":
      return <ButtonAsButtonTag {...props} />;
    case "a":
      return <ButtonAsAnchorTag {...props} />;
    default:
      // compilation fails if all cases are not covered
      throw new ExhaustiveError(componentType);
  }
};
