"use client";

import { Button } from "@/modules/common/components/button";

const Error = ({
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) => {
  return (
    <div className="error-page">
      <div className="container page">
        <p className="error-message">⚠️Something went wrong!</p>
        <Button component="button" size="lg" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
};

export default Error;
