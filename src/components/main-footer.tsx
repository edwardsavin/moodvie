import { Separator } from "./ui/separator";

const MainFooter = () => (
  <footer className="mt-auto w-full py-12 text-center">
    <div className="flex items-center justify-center gap-2">
      <p className="text-gray-500">Copyright © {new Date().getFullYear()}</p>
      <Separator orientation="vertical" className="h-4" />
      <a
        href="https://edwardcs.com"
        className="text-xl font-semibold text-green-500 hover:text-green-700"
        target="_blank"
      >
        Edward Savin
      </a>
    </div>
  </footer>
);

export default MainFooter;
