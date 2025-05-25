import { Res } from "./res";

export type StringArrayParamFx = (data: string[]) => void;

export type ResParamFx = (data: Res) => void;

export type BoolParamFx = (data: boolean) => void;

export type StringParamFx = (data: string) => void;

export type RecordArrayParamFx = (data: Record<string, any>[]) => void;

export type ArrayParamFx = (data: any[]) => void;