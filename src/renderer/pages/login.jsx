import new_api from "../new_api/new_api";

export default function Login() {
    const on = function () {
        alert("היי מורגי");
        var user_form = document.getElementById("user_form");
        var user_form_data = new FormData(user_form);
        const formDataObj = {};
        user_form_data.forEach((value, key) => (formDataObj[key] = value));
        console.log(formDataObj);
        new_api.users
            .login(formDataObj.user_name, formDataObj.password)
            .then((json) => console.log(json));
    };
    async function active() {
        var act_user = await new_api.users.get_active();
        console.log(act_user);
    }
    return (
        <>
            <form id="user_form">
                <label htmlFor="user_name"> user name </label>
                <input
                    type="text"
                    name="user_name"
                    style={{ backgroundColor: "red" }}
                />
                <br />
                <label htmlFor="password"> password </label>
                <input
                    type="text"
                    name="password"
                    style={{ backgroundColor: "red" }}
                />
                <br />
                <div id="login_button" className="hive-button" onClick={on}>
                    {" "}
                    התחבר{" "}
                </div>
            </form>

            <button onClick={active}> משתמש </button>
        </>
    );
}
