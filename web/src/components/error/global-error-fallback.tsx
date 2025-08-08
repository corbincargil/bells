export const GlobalErrorFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-4xl font-bold">Error</h1>
      <p className="text-lg">An error occurred while loading the page 😢</p>
    </div>
  );
};
