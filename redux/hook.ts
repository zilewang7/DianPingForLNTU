import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";
import { RootState } from "./store";

const useSelectorWithType: TypedUseSelectorHook<RootState> = useSelector;

export { useSelectorWithType as useSelector };
