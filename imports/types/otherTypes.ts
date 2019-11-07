import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { IUnfetchedSong } from './songTypes';

export interface IIconButtonProps {
  ariaLabel?: string;
  className?: string;
  color?: 'inherit' | 'primary' | 'secondary' | 'default';
  disable?: (condition: boolean) => boolean;
  Icon: (props: SvgIconProps) => JSX.Element;
  onClick: (song: IUnfetchedSong) => () => void;
}
