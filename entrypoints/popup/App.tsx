import './App.css';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input';
import { MessageType } from '@/entrypoints/types.ts';
import { useEffect, useState } from 'react';

function App() {
  const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    async function getCurrentSize() {
      const win = await browser.windows.getCurrent();
      setCurrentSize({ width: win.width ?? 0, height: win.height ?? 0 });
    }
    getCurrentSize();
  }, []);
  async function sendMessageToBackground() {
    const win = await browser.windows.getLastFocused();
    if (win.id) {
      await browser.windows.update(win.id, { focused: true, ...currentSize });
    }
  }

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSize({
      width: parseInt(e.target.value),
      height: currentSize.height,
    });
  };
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSize({
      width: currentSize.width,
      height: parseInt(e.target.value),
    });
  };
  return (
    <div className="flex flex-col gap-2 items-center justify-center p-4">
      <div className="flex flex-col gap-2 items-center justify-center">
        <div className="flex gap-1 items-center justify-center">
          <Input
            type="number"
            size={12}
            min={500}
            value={currentSize.width}
            onChange={handleWidthChange}
          />
          x
          <Input
            type="number"
            size={12}
            min={500}
            value={currentSize.height}
            onChange={handleHeightChange}
          />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <Button className="w-full" onClick={sendMessageToBackground}>
          Change Size
        </Button>
      </div>
    </div>
  );
}

export default App;
