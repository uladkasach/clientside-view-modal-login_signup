# clientside-view-modal-login_signup

```js
    load("clientside-view-loader")
        .then(view=>view.load("clientside-view-modal-login_signup").build());
        .then((modal)=>{
            document.body.appendChild(modal);
            modal.show("login");
        })
```

generates a fully functional one of these:

![screenshot_2018-02-10_15-42-31](https://user-images.githubusercontent.com/10381896/36066524-0dc14f7a-0e79-11e8-86c5-10a10b695185.png)


with which you can do things like this:

```js
.then((modal)=>{
    document.querySelector("#signup_button").onclick = ()=>{modal.handler.show("signup")}
    document.querySelector("#loginup_button").onclick = ()=>{modal.handler.show("login")}
    modal.submission_button.signup.onclick = function(){
        require("clientside-controller-user_sessions")
            .then((controller)=>{
                return controller.signin("signup", {
                    email : modal.extract.email(),
                    password : modal.extract.password(),
                })
            })
            .then((response)=>{
                alert("Success!");
                modal.submission_button.login.onclick(); // after signup automatically sign user in
            })
    }
    modal.submission_button.login.onclick = function(){
        require("clientside-controller-user_sessions")
            .then((controller)=>{
                return controller.signin("login", {
                    email : modal.extract.email(),
                    password : modal.extract.password(),
                })
            })
            .then((response)=>{
                if(response == "SCS"){
                    window.location.href = "/my/dashboard";
                } else {
                    console.error("Response for login was not expected: " + response)
                    alert("An unknown error has occured.");
                }
            })
    }
})

```
