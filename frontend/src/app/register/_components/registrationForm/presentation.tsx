import { Button } from "@/modules/common/components/button";
import { ErrorMessage } from "@/modules/common/components/errorMessage";
import { SubmissionResult, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { startTransition } from "react";
import { inputsSchema } from "./types";

type Props = {
  action?: (formData: FormData) => void;
  isPending?: boolean;
  result?: SubmissionResult<string[]>;
};

export const RegistrationForm = ({ result, action, isPending }: Props) => {
  const [form, fields] = useForm({
    lastResult: result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: inputsSchema });
    },
    // onSubmit is defined to avoid resetting form after successful submission
    // see https://github.com/edmundhung/conform/discussions/606
    onSubmit(event, { formData }) {
      event.preventDefault();
      startTransition(() => {
        action?.(formData);
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onBlur",
  });

  return (
    <>
      <ErrorMessage messages={form.errors} />
      <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate={true}>
        <fieldset className="form-group">
          <input
            type="text"
            key={fields.username.key}
            name={fields.username.name}
            defaultValue={fields.username.initialValue}
            placeholder="Username"
            className="form-control form-control-lg"
          />
          <ErrorMessage messages={fields.username.errors} />
        </fieldset>
        <fieldset className="form-group">
          <input
            type="email"
            key={fields.email.key}
            name={fields.email.name}
            defaultValue={fields.email.initialValue}
            placeholder="Email"
            className="form-control form-control-lg"
          />
          <ErrorMessage messages={fields.email.errors} />
        </fieldset>
        <fieldset className="form-group">
          <input
            type="password"
            key={fields.password.key}
            name={fields.password.name}
            defaultValue={fields.password.initialValue}
            placeholder="Password"
            className="form-control form-control-lg"
            autoComplete="new-password"
          />
          <ErrorMessage messages={fields.password.errors} />
        </fieldset>
        <Button
          component="button"
          size="lg"
          variant="filled"
          type="submit"
          className="pull-xs-right"
          disabled={isPending}
        >
          Sign up
        </Button>
      </form>
    </>
  );
};
