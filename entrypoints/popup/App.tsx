import { Checkbox } from '@/components/ui/checkbox';
import './App.css';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input';
import { MessageType } from '@/entrypoints/types.ts';
import { useEffect, useState } from 'react';

function App() {
  const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });
  const [resizeAll, setResizeAll] = useState(false);
  useEffect(() => {
    async function getCurrentSize() {
      const win = await browser.windows.getCurrent();
      setCurrentSize({
        width: Math.max(win.width ?? 0, 500),
        height: Math.max(win.height ?? 0, 500),
      });
    }
    getCurrentSize();
    // @ts-ignore
    browser.windows.onBoundsChanged.addListener(getCurrentSize);
    return () => {
      // @ts-ignore
      browser.windows.onBoundsChanged.removeListener(getCurrentSize);
    };
  }, []);
  async function sendMessageToBackground() {
    const win = await browser.windows.getLastFocused();
    console.log('sendMessageToBackground', resizeAll);
    if (resizeAll) {
      const windows = await browser.windows.getAll();
      for (const win of windows) {
        if (win.id) {
          await browser.windows.update(win.id, {
            ...currentSize,
          });
        }
      }
    } else {
      if (win.id) {
        await browser.windows.update(win.id, { focused: true, ...currentSize });
      }
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
      <div className="flex flex-row gap-2 items-center justify-center">
        <div className="w-[55px] text-left">Size</div>
        <div className="flex flex-1 gap-1 items-center justify-center">
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
      <div className="w-full flex flex-row space-x-2 items-center">
        <div>Resize All</div>
        <Checkbox
          checked={resizeAll}
          onCheckedChange={(checked) => {
            setResizeAll(!!checked);
          }}
        />
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
