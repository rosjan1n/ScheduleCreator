import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
    </div>
  );
};

export default Loader;
