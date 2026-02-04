export const BaseIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Base</title>
      <rect fill="white" height="256" rx="128" width="256" />
      <rect fill="#0000FF" height="128" rx="8" width="128" x="64" y="64" />
    </svg>
  );
};
