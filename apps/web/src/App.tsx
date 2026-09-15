import { ParsePanel } from "./components/ui/parse-panel.tsx";

function App() {
  return (
    <div
      id="App"
      className="flex min-h-screen items-center justify-center bg-(image:--background-image-page-gradient) p-4 sm:p-8"
    >
      <main className="w-full sm:w-300">
        <ParsePanel />
      </main>
    </div>
  );
}

export default App;
