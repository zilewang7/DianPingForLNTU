import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef<any>();

export function navigate(name, params?) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}