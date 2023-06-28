import {
  HeartIcon,
  ShoppingBagIcon,
  MusicalNoteIcon,
  CursorArrowRaysIcon,
} from "@heroicons/react/24/solid";

type ButtonVariant = "wishlist" | "basket" | "collection" | "select";

interface AddButtonProps {
  className?: string;
  variant: ButtonVariant;
  onClick?: () => void;
}

const VARIANT_CONTENT: Record<ButtonVariant, JSX.Element> = {
  wishlist: (
    <>
      <HeartIcon className="mr-2 h-6 w-6 text-red-500 " /> Add to wishlist{" "}
    </>
  ),
  basket: (
    <>
      <ShoppingBagIcon className="mr-2 h-6 w-6  " /> Add to basket{" "}
    </>
  ),
  collection: (
    <>
      <MusicalNoteIcon className="mr-2 h-6 w-6 " /> Add to collection{" "}
    </>
  ),
  select: (
    <>
      <CursorArrowRaysIcon className="mr-2 h-6 w-6 " /> Select listing{" "}
    </>
  ),
};

export default function Button({
  variant,
  onClick,
  className,
}: AddButtonProps) {
  return (
    <button className={className} onClick={onClick}>
      {VARIANT_CONTENT[variant]}
    </button>
  );
}