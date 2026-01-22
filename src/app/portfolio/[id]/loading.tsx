import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <main className="w-full min-h-screen md:fixed md:inset-0 md:h-full md:overflow-hidden flex flex-col items-center justify-start p-2 sm:p-4 pt-4 md:pt-3">
            <div
                className="flex flex-col bg-white dark:bg-retro-dark-blue border-2 border-black dark:border-white shadow-retro dark:shadow-[4px_4px_0px_0px_#ffffff] w-full max-w-5xl mx-auto my-0 md:flex-1 md:min-h-0 transition-colors duration-300"
            >
                {/* Title Bar */}
                <div className="w-full bg-white dark:bg-retro-dark-blue border-b-2 border-black dark:border-white px-2 py-1 flex items-center justify-center relative z-20 h-12 shrink-0 select-none transition-colors duration-300">
                    {/* Title with striped background */}
                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                        {/* Stripes */}
                        <div className="absolute inset-0 flex flex-col justify-center gap-[3px] opacity-100 z-0">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-full h-[1px] bg-black dark:bg-white transition-colors duration-300"></div>
                            ))}
                        </div>

                        {/* Title Text with white background to cover stripes */}
                        <div className="relative z-10 px-4 bg-white dark:bg-retro-dark-blue border-x-2 border-black dark:border-white transition-colors duration-300">
                            <h2 className="text-xl font-chicago tracking-normal pt-1 text-retro-text">Loading...</h2>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="md:flex-1 p-2 sm:p-2 bg-white dark:bg-retro-dark-blue md:min-h-0 transition-colors duration-300 flex flex-col h-full min-h-[300px]">
                    <div className="h-full w-full border border-black dark:border-white relative overflow-hidden bg-white dark:bg-retro-dark-blue transition-colors duration-300 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-black dark:text-white" />
                            <p className="font-chicago text-black dark:text-white animate-pulse">Please Wait...</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
