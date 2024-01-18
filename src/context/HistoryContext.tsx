import { useRouter } from "next/router";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const HistoryContext = createContext(['']);

type Props = {
  children: ReactNode
}

const HistoryContextProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();

  // コンポーネントが初回評価されるタイミングとhistoryのstateが更新完了されるタイミングが
  // historyのstate更新が後になりワンテンポずれるので、使用先の初回レンダリングの過程でhistory stateを使用する際は
  // 初回レンダリングが完了していない間は前ページでのstateの状態なので注意して使用されたし
  // 具体的に
  // 初回レンダリングの過程ではstateが更新される前となるため、配列の左から[直前のpath, 2つ前のpath, 3つ前のpath]
  // 初回レンダリング後ではstate更新後なので、配列の左から[現在のpath, 直前のpath, 2つ前のpath]
  // を意味する様になるので注意されたし。
  const [history, setHistory] = useState<string[]>([router.asPath, '', '']);

  useEffect(() => {
    setHistory([router.asPath, history[0], history[1]]);
  }, [router.asPath]);

  return (
    <>
      <HistoryContext.Provider value={history}>
        {children}
      </HistoryContext.Provider>
    </>
  );
}

const usePathHistory = () => {
  const history = useContext(HistoryContext)

  return history;
}

export {
  HistoryContextProvider,
  HistoryContext,
  usePathHistory,
}
