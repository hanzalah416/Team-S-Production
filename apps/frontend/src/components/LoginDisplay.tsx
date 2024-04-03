export function LoginDisplay(props: {
    loginData: { username: string; password: string };
}) {
    return (
        <div
            className={
                "justify-items-center w-full text-2xl border-2 border-gray-400 rounded-2xl p-10 flex flex-col gap-5 rounded-2"
            }
        >
            <div className={"flex flex-col justify-items-center gap-2 px-10"}>
                <h1>Username:</h1>
                <p className={"pl-16"}>{props.loginData.username}</p>
            </div>
            <div className={"flex flex-col justify-items-center gap-2 px-10"}>
                <h1>Password:</h1>
                <p className={"pl-16"}>{props.loginData.password}</p>
            </div>
        </div>
    );
}
