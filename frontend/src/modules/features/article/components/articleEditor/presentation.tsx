import { Button } from "@/modules/common/components/button";
import { ErrorMessage } from "@/modules/common/components/errorMessage";
import { Article } from "@/utils/types/models";
import { SubmissionResult, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { KeyboardEventHandler, startTransition } from "react";
import { Tag } from "../tag";
import styles from "./presentation.module.css";
import { inputsSchema } from "./types";

type Props = {
  defaultValues?: Article;
  action?: (formData: FormData) => void;
  isPending?: boolean;
  result?: SubmissionResult<string[]>;
};

export const ArticleEditor = ({ defaultValues, result, action, isPending }: Props) => {
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
    defaultValue: { ...defaultValues },
    shouldValidate: "onBlur",
    shouldRevalidate: "onBlur",
  });

  const tagListErrors = Object.values(fields.tagList.allErrors).flat();

  const onTagFormKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    switch (event.key) {
      case "Enter":
        // prevent form submit
        event.preventDefault();

        const tag = fields.tag.value;
        if (!tag) {
          return;
        }
        form.insert({ name: fields.tagList.name, defaultValue: tag });
      default:
        return;
    }
  };

  const onClickRemoveTag = (index: number) => {
    form.remove({ name: fields.tagList.name, index });
  };

  return (
    <>
      <ErrorMessage messages={form.errors} />
      <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate={true}>
        <input type="hidden" key={fields.slug.key} name={fields.slug.name} defaultValue={fields.slug.initialValue} />
        <fieldset>
          <fieldset className="form-group">
            <input
              type="text"
              key={fields.title.key}
              name={fields.title.name}
              defaultValue={fields.title.initialValue}
              placeholder="Article Title"
              className="form-control form-control-lg"
            />
            <ErrorMessage messages={fields.title.errors} />
          </fieldset>
          <fieldset className="form-group">
            <input
              type="text"
              key={fields.description.key}
              name={fields.description.name}
              defaultValue={fields.description.initialValue}
              placeholder="What's this article about?"
              className="form-control"
            />
            <ErrorMessage messages={fields.description.errors} />
          </fieldset>
          <fieldset className="form-group">
            <textarea
              key={fields.body.key}
              name={fields.body.name}
              defaultValue={fields.body.initialValue}
              rows={8}
              placeholder="Write your article (in markdown)"
              className="form-control"
            />
            <ErrorMessage messages={fields.body.errors} />
          </fieldset>
          <fieldset className="form-group">
            <input
              type="text"
              key={fields.tag.key}
              name={fields.tag.name}
              defaultValue={fields.tag.initialValue}
              placeholder="Enter tags"
              onKeyDown={onTagFormKeyDown}
              className="form-control"
            />
            <ul className="tag-list">
              {fields.tagList.getFieldList().map((tagField, index) => (
                <li key={tagField.key}>
                  <Tag component="span" variant="filled" className={styles["tag-form"]}>
                    <input type="hidden" name={tagField.name} value={tagField.value} />
                    <button onClick={() => onClickRemoveTag(index)}>
                      <i className="ion-close-round" />
                    </button>
                    {tagField.value}
                  </Tag>
                </li>
              ))}
            </ul>
            <ErrorMessage messages={tagListErrors} />
          </fieldset>
          <Button
            component="button"
            size="lg"
            color="primary"
            variant="filled"
            type="submit"
            className="pull-xs-right"
            disabled={isPending}
          >
            Publish Article
          </Button>
        </fieldset>
      </form>
    </>
  );
};
