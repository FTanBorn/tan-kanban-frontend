// src/types/command.d.ts

declare module "cmdk" {
  interface CommandProps {
    children?: React.ReactNode;
  }

  interface CommandInputProps {
    placeholder?: string;
  }

  interface CommandEmptyProps {
    children?: React.ReactNode;
  }

  interface CommandGroupProps {
    children?: React.ReactNode;
  }

  interface CommandItemProps {
    children?: React.ReactNode;
    onSelect?: () => void;
  }
}
