import { Meteor } from 'meteor/meteor';
import { MouseEventHandler } from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { IFolder, ISong, IUnfetched } from '.';

export type IElement = ISong | IUnfetched<ISong> | IFolder | IUnfetched<IFolder> | undefined;
export type IIconColor = 'inherit' | 'primary' | 'secondary' | 'default';
export type IButtonSize = 'small' | 'medium' | 'large';
export type IIcon = (props: SvgIconProps) => JSX.Element;
export type IButtonVariant = 'text' | 'outlined' | 'contained';
export type IIconButtonCallback = (err: Meteor.Error | null, res: void) => void;

export interface IIconButtonBuildProps<E> {
  element?: E;
  otherParams?: object;
}
export interface IIconButtonBWCbProps<E> extends IIconButtonBuildProps<E> {
  callback: IIconButtonCallback;
}

export type IFn<E, T> = {
  build: (props: IIconButtonBuildProps<E>) => T;
} | {
  build: (props: IIconButtonBWCbProps<E>) => T;
  callback: true;
}

/**
 IconButtonsProps are used in generic layout components as prop objects
 to build styled icon buttons, whom content is passed from parent.

 In parent component:
 ```
    <LayoutComponent<E>
      iconButton={{
        className?: string | IFn<E, string>;
        color?: IIconColor | IFn<E, IIconColor>;
        disabled?: boolean | IFn<E, boolean>;
        Icon: IIcon | IFnFn<E, IIcon>;
        label: string | IFn<E, string>;
        labelVisible?: boolean | IFn<E, boolean>;
        onClick: MouseEventHandler | IFnFn<E, MouseEventHandler>;
      }}
    />
 ```
 See the [[IFn]] interface for more details.

 In layout component:
 See the ListItemIcon and ListItemSecondaryAction
 in {@link ListLayoutItem.render | ListLayoutItem}
*/
export interface IIconButtonProps<E> {
  className?: string | IFn<E, string>;
  color?: IIconColor | IFn<E, IIconColor>;
  disabled?: boolean | IFn<E, boolean>;
  Icon?: IIcon | IFn<E, IIcon>;
  label: string | IFn<E, string>;
  labelVisible?: boolean | IFn<E, boolean>;
  onClick: MouseEventHandler | IFn<E, MouseEventHandler>;
  size?: IButtonSize | IFn<E, IButtonSize>;
  variant?: IButtonVariant | IFn<E, IButtonVariant>;
}

export interface IArrayIconButtonProps<E> extends IIconButtonProps<E> {
  key: string;
}
