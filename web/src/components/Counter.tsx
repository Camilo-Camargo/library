import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export type CounterProps = {
  min?: number;
  max?: number;
  onChange?: (n: number) => void;
  defaultValue?: number;
};

export function Counter(props: CounterProps) {
  const [counter, setCounter] = useState<number>(
    props.defaultValue ?? props.min ?? 0
  );

  useEffect(() => {
    if (props.onChange) props.onChange(counter);
  }, [counter]);

  const onIncrement = () => {
    if (props.max && counter + 1 > props.max) {
      return;
    }
    setCounter(counter + 1);
  };

  const onDecrement = () => {
    if (props.min && counter - 1 < props.min) {
      return;
    }
    setCounter(counter - 1);
  };

  return (
    <div className="flex w-full gap-2">
      <div
        onClick={onDecrement}
        className="flex w-full items-center justify-center p-1 border rounded"
      >
        <Minus />
      </div>
      <span className="flex p-2 w-full border rounded items-center justify-center">
        {counter}
      </span>
      <div
        onClick={onIncrement}
        className="flex w-full items-center justify-center p-1 border rounded"
      >
        <Plus />
      </div>
    </div>
  );
}
