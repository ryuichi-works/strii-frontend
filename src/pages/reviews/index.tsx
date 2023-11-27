import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import AuthCheck from "@/components/AuthCheck";

const ReviewList = () => {
  const { isAuth, user, setUser, setIsAuth } = useContext(AuthContext);

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <h1>ストリングレビュー</h1>
        )}
      </AuthCheck>
    </>
  );
}

export default ReviewList;
