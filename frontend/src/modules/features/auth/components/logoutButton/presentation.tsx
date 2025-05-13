import { Button } from "@/modules/common/components/button";

type Props = { action?: () => void; isPending?: boolean };

export const LogoutButton = ({ action, isPending }: Props) => {
  return (
    <form action={action}>
      <Button component="button" color="danger" type="submit" size="lg" disabled={isPending}>
        Or click here to logout.
      </Button>
    </form>
  );
};
