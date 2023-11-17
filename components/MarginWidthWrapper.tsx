import { ReactNode } from "react";

export default function MarginWidthWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col md:ml-60 pt-12 min-h-screen">{children}</div>
  );
}
