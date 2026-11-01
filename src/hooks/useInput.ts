import { useState } from "react";
import { ChangeEvent } from "react";

export default function useInput(initialValue = "") {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
      }
    }
  };
}
