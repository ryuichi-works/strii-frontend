import { useContext } from "react";
import DropDownMenu from "./DropDownMenu";
import HeaderNavLink from "./HeaderNavLink";
import { AuthContext } from "@/context/AuthContext";

type UserHeaderNavProps = {
  logoutHandler: ((e: React.FormEvent<HTMLFormElement>, authType: 'users' | 'admins') => Promise<void>)
}

const UserHeaderNav: React.FC<UserHeaderNavProps> = ({
  logoutHandler
}) => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <DropDownMenu
        dropDownTitle="レビュー"
        listClassName="pr-4 h-[64px]"
        dropDownAreaWidth="w-[160px]"
      >
        <hr />

        <HeaderNavLink
          linkText="投稿一覧"
          className="p-2"
          href="/reviews"
        />

        <hr />

        <HeaderNavLink
          linkText="レビュー投稿"
          className="p-2"
          href="/reviews/register"
        />
      </DropDownMenu>

      <DropDownMenu
        dropDownTitle="マイ装備"
        listClassName="mr-4 h-[64px]"
        dropDownAreaWidth="w-[180px]"
      >
        <hr />

        <HeaderNavLink
          linkText="マイ装備一覧"
          className="p-2"
          href="/my_equipments"
        />

        <hr />

        <HeaderNavLink
          linkText="マイ装備追加"
          className="p-2"
          href="/my_equipments/register"
        />
      </DropDownMenu>

      <HeaderNavLink
        linkText="ストリング"
        className="mr-4"
        href="/guts"
      />

      <HeaderNavLink
        linkText="ラケット"
        className="mr-4"
        href="/rackets"
      />

      <DropDownMenu
        dropDownTitle="画像提供"
        listClassName="mr-4 h-[64px]"
        dropDownAreaWidth="w-[180px]"
      >
        <hr />

        <HeaderNavLink
          linkText="ストリング画像提供"
          className="p-2"
          href="/gut_images/register"
        />

        <hr />

        <HeaderNavLink
          linkText="ラケット画像提供"
          className="p-2"
          href="/racket_images/register"
        />
      </DropDownMenu>

      <HeaderNavLink
        linkText="プロフィール"
        className="mr-4"
        href={`/users/${user.id}/profile`}
      />

      <li>
        <form
          onSubmit={(e) => logoutHandler(e, 'users')}
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

export default UserHeaderNav;
