import { createContext, Dispatch, SetStateAction } from 'react';
import { ITutorialContentName } from './Tutorial';

export type TutorialSetStateContext = Dispatch<SetStateAction<ITutorialContentName>> | undefined;

const TutorialContext = createContext<TutorialSetStateContext>(undefined);

export default TutorialContext;
