export type ButtonProps = {
  title: string;
  variant:
    | "primary"
    | "secondary"
    | "danger"
    | "primary-border"
    | "secondary-border"
    | "danger-border";

  onClick?: () => void;
};
export function Button(props: ButtonProps) {
  let className = "flex p-3 rounded w-full items-center justify-center";

  switch (props.variant) {
    case "primary":
      className += " bg-primary text-white border border-black";
      break;
    case "secondary":
      className += " bg-secondary text-black border border-black";
      break;
    case "danger":
      className += " bg-danger text-white border border-black ";
      break;
    case "primary-border":
      className += " text-primary border border-primary";
      break;
    case "secondary-border":
      className += " text-secondary border border-secondary";
      break;
    case "danger-border":
      className += " text-danger border border-danger";
      break;
  }

  return (
    <div>
      <button onClick={props.onClick} className={className}>{props.title}</button>
    </div>
  );
}
