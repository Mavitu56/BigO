import * as React from "react";
import { MaterialIcons } from "@expo/vector-icons";
export interface IIconProps {
    disabled?: boolean;
    iconID: React.ComponentProps<typeof MaterialIcons>["name"];
    text: string;
}
export declare function Icon(props: IIconProps): JSX.Element;
