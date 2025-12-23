import { Link } from "@tanstack/react-router"
import { Button } from "./ui/button"

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex justify-center w-full mt-10">
      <div className="space-y-2 p-2 items-center flex flex-col">
        <div className="text-gray-600 dark:text-gray-400">
          {children || <p>The page you are looking for does not exist.</p>}
        </div>
        <p className="flex items-center gap-2 flex-wrap">
          <Button onClick={() => window.history.back()}>Go back</Button>
          <Button asChild className="bg-emerald-500 hover:bg-emerald-500/90">
            <Link to="/">Start Over</Link>
          </Button>
        </p>
      </div>{" "}
    </div>
  )
}
