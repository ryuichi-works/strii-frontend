import React, { useEffect, useReducer, useState } from "react";

export type EvaluationVal =
  | 0 | 0.0
  | 1 | 1.0
  | 1.5
  | 2 | 2.0
  | 2.5
  | 3 | 3.0
  | 3.5
  | 4 | 4.0
  | 4.5
  | 5 | 5.0

type BarGraphProps = {
  areaSize: SizeType,
  evaluationVal: EvaluationVal,
  graphHeight: string
}

type GraphWidth =
  | "w-[0%]"
  | "w-[10%]"
  | "w-[30%]"
  | "w-[40%]"
  | "w-[50%]"
  | "w-[60%]"
  | "w-[70%]"
  | "w-[80%]"
  | "w-[90%]"
  | "w-[100%]"
  | undefined;

type graphWidthAction = {
  type: number,
  payload?: any
}

const graphWidthReducer = (
  state: GraphWidth,
  { type, payload }: graphWidthAction
) => {
  switch (type) {
    case 0 | 0.0:
      return 'w-[0%]';
    case 0.5:
      return 'w-[10%]';
    case 1 | 1.0:
      return 'w-[10%]';
    case 1.5:
      return 'w-[30%]';
    case 2 | 2.0:
      return 'w-[40%]';
    case 2.5:
      return 'w-[50%]';
    case 3 | 3.0:
      return 'w-[60%]';
    case 3.5:
      return 'w-[70%]';
    case 4 | 4.0:
      return 'w-[80%]';
    case 4.5:
      return 'w-[90%]';
    case 5 | 5.0:
      return 'w-[100%]';
  }
}

type SizeType = 'sp' | 'md'

type Size =
  | 'max-w-[104px]'
  | 'max-w-[128px]'
  | undefined;


type AreaSizeAction = {
  type: SizeType,
  payload?: any
}

const areaSizeReducer = (
  state: Size,
  { type, payload }: AreaSizeAction
) => {
  switch (type) {
    case 'sp':
      return 'max-w-[104px]';
    case 'md':
      return 'max-w-[128px]';
  }
}

const BarGraph: React.FC<BarGraphProps> = ({
  areaSize = 'sp',
  evaluationVal,
  graphHeight
}) => {
  const [areaSizeClassName, areaSizeClassNameDispatch] = useReducer(areaSizeReducer, 'max-w-[104px]')

  const [graphWidthClassName, graphWidthClassNameDispatch] = useReducer(graphWidthReducer, 'w-[0%]');

  useEffect(() => {
    graphWidthClassNameDispatch({ type: evaluationVal })
    areaSizeClassNameDispatch({ type: areaSize })
  }, [])

  return (
    <>
      <div className={`relative w-[100%] ${areaSizeClassName} ${graphHeight}`}>
        {/* bar area */}
        <div className={`w-[100%] ${areaSizeClassName} ${graphHeight} bg-gray-200 absolute top-0 left-0 z-0`}>
          <span></span>
        </div>

        {/* 可変　bar */}
        <div className={`${graphWidthClassName} ${areaSizeClassName} ${graphHeight} bg-sub-green absolute top-0 left-0 z-20`}>
          <span></span>
        </div>
      </div>
    </>
  );
}

export default BarGraph;
