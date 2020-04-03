import { RouteProps } from 'react-router-dom';

export type IRouteBranchName =
| 'about'
| ':authorSlug'
| 'broadcast'
| ':broadcastId'
| 'createdSong'
| 'createdSongs'
| 'dashboard'
| 'favoriteSong'
| 'favoriteSongs'
| 'folder'
| 'folders'
| ':folderSlug'
| 'home'
| 'lang'
| 'notFound'
| 'signin'
| 'signup'
| 'song'
| ':songSlug'
| 'reception'
| 'receptionId'
| ':titleSlug';

export interface IRouteProps extends RouteProps {
  name?: IRouteBranchName;
  auth?: boolean;
  redirection?: IRouteBranchName;
}
