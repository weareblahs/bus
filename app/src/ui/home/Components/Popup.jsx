import { Transition } from "@headlessui/react";
import { useState } from "react";
import clsx from "clsx";

export const Popup = ({ text }) => {
  const [textDetected, setText] = useState("");
  return (
    <div className="absolute bottom-0 flex">
      <Transition show={text != ""}>
        <div
          className={clsx([
            // Base styles
            "px-8 py-4 justify-center text-center flex rounded-xl bottom-8 bg-green-800",
            // Shared closed styles
            "data-closed:opacity-0",
            // Entering styles
            "data-enter:duration-100 ease-in",
            // Leaving styles
            "data-leave:duration-100 ease-out",
          ])}
        >
          <div className="flex">
            <h1 className="ms-2 me-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
            </h1>
            <h1>{text}</h1>
          </div>
        </div>
      </Transition>
    </div>
  );
};
