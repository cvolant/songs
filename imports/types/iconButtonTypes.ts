import { Meteor } from 'meteor/meteor';
import { MouseEventHandler } from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { IUnfetchedFolder } from './folderTypes';
import { IUnfetchedSong } from './songTypes';

type IElement = IUnfetchedSong | IUnfetchedFolder;

export type IIconColor = 'inherit' | 'primary' | 'secondary' | 'default';

export type IIcon = (props: SvgIconProps) => JSX.Element;

export type IFn<T> = (element: IElement, params?: object) => T;

export interface IFnFn<T> {
  build: (
    element: IElement,
    callback?: (err: Meteor.Error, res: object) => void,
    params?: object,
  ) => T;
}

export interface IIconButtonProps {
  ariaLabel?: string | IFn<string>;
  className?: string | IFn<string>;
  color?: IIconColor | IFn<IIconColor>;
  disabled?: boolean | IFn<boolean>;
  Icon: IIcon | IFnFn<IIcon>;
  onClick: MouseEventHandler | IFnFn<MouseEventHandler>;
}

export interface IArrayIconButtonProps extends IIconButtonProps {
  key: string;
}

export const fn = <T extends (string | IIconColor | boolean | undefined)>(
  stuff: T | IFn<T>,
  element: IElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: object,
): T | undefined => (typeof stuff === 'function' ? stuff(element, params) : stuff);

export const fnFn = <T>(
  stuff: T | IFnFn<T>,
  element: IElement,
  callback?: (err: Meteor.Error, res: object) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: object,
): T => (stuff && 'build' in stuff ? stuff.build(element, callback, params) : stuff);
