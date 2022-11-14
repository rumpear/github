export interface ISearchFieldProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}

export type THandleInputChange = React.ChangeEventHandler<HTMLInputElement>;
