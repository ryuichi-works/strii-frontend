import { useContext } from "react";
import DropDownMenu from "./DropDownMenu";
import HeaderNavLink from "./HeaderNavLink";
import { AuthContext } from "@/context/AuthContext";

type AdminHeaderNavProps = {
  logoutHandler: ((e: React.FormEvent<HTMLFormElement>, authType: 'users' | 'admins') => Promise<void>)
}

const AdminHeaderNav: React.FC<AdminHeaderNavProps> = ({
  logoutHandler
}) => {
  const { admin } = useContext(AuthContext);

  return (
    <>
      <HeaderNavLink
        linkText="dashboard"
        className="mr-4"
        href={`/admins/${admin.id}/dashboard`}
      />


      <DropDownMenu
        dropDownTitle="ストリング"
        listClassName="mr-4 h-[64px]"
        dropDownAreaWidth="w-[180px]"
      >
        <hr />

        <HeaderNavLink
          linkText="ストリング一覧"
          className="p-2"
          href="/guts"
        />

        <hr />

        <HeaderNavLink
          linkText="ストリング登録"
          className="p-2"
          href="/guts/register"
        />
      </DropDownMenu>

      <DropDownMenu
        dropDownTitle="ラケット"
        listClassName="mr-4 h-[64px]"
        dropDownAreaWidth="w-[180px]"
      >
        <hr />

        <HeaderNavLink
          linkText="ラケット一覧"
          className="p-2"
          href="/rackets"
        />

        <hr />

        <HeaderNavLink
          linkText="ラケット登録"
          className="p-2"
          href="/rackets/register"
        />
      </DropDownMenu>

      <DropDownMenu
        dropDownTitle="画像追加"
        listClassName="mr-4 h-[64px]"
        dropDownAreaWidth="w-[180px]"
      >
        <hr />

        <HeaderNavLink
          linkText="ストリング画像追加"
          className="p-2"
          href="/gut_images/register"
        />

        <hr />

        <HeaderNavLink
          linkText="ラケット画像追加"
          className="p-2"
          href="/racket_images/register"
        />
      </DropDownMenu>

      <li>
        <form
          onSubmit={(e) => logoutHandler(e, 'admins')}
          className="flex justify-center items-center h-[64px]"
        >
          <button
            type='submit'
            className="inline-block hover:opacity-80"
          >ログアウト</button>
        </form>
      </li>
    </>
  );
}

export default AdminHeaderNav;
