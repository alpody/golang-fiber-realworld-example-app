type Props = {
  messages?: string[];
};

export const ErrorMessage = ({ messages }: Props) => {
  return (
    messages &&
    messages.length > 0 && (
      <ul className="error-messages" aria-live="polite">
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    )
  );
};
