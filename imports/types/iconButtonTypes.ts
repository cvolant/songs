/*
<summary>
</summary>

<usage>
  <usage title="From parent (content giver)">
    <code>
    </code>
    <remarks>
      IFn are functions which return the required type.
      Those functions can take the element (ISong or IFolder) as parameter.
      <exemple from={FolderDashboard}>
        label: (searchedSong: IUnfetched<ISong>): string => (
          folderSongIdStrings.includes(searchedSong._id.toHexString())
            ? t('folder.Remove this song', 'Remove this song')
            : t('folder.Add this song', 'Add this song')
        ),
      </exemple>
      This function can optionaly take an optional extra object parameter.
    </remarks>
    <remarks>
      Icon and onClick use IFnFn instead of IFn. IFnFn are objects with a
      'build' property, to make type checking easier.
      The build property is a IFn function with a callback parameter
      in 2nd position.
    </remarks>
  </usage>

  <usage title="From child component (layout builder)">
    <see cref={ListLayoutItem}
<remarks>
  <see cref="IIcon" />
</remarks>
</usage>
*/
import { Meteor } from 'meteor/meteor';
import { MouseEventHandler } from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { IFolder, ISong, IUnfetched } from '.';

export type IElement = ISong | IUnfetched<ISong> | IFolder | IUnfetched<IFolder> | undefined;
export type IIconColor = 'inherit' | 'primary' | 'secondary' | 'default';
export type IIcon = (props: SvgIconProps) => JSX.Element;
export type IButtonVariant = 'text' | 'outlined' | 'contained' | 'extended';
export type IIconButtonCallback = (err: Meteor.Error, res: void) => void;

export interface IIconButtonBuildProps<E> {
  element?: E;
  otherParams?: object;
}
export interface IIconButtonBuildWithCallbackProps<E> extends IIconButtonBuildProps<E> {
  callback: IIconButtonCallback;
}

export type IFn<E, T> = {
  build: (props: IIconButtonBuildProps<E>) => T;
} | {
  build: (props: IIconButtonBuildWithCallbackProps<E>) => T;
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
  variant?: IButtonVariant | IFn<E, IButtonVariant>;
}

export interface IArrayIconButtonProps<E> extends IIconButtonProps<E> {
  key: string;
}
