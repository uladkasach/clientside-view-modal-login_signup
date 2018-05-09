var view_loader = load("clientside-view-loader");
view_loader.load = function(path){ return this.then((view_loader)=>{ return view_loader.load(path)})} // define `view_loader.load()` to the view_loader promise

module.exports = {
    generate : function(dom, options){

        /*
            generate ui elements ---------------------------------------------------------------------
        */
        var promise_all_buttons = view_loader.load("clientside-view-button")
            .then((compiler)=>{
                var promise_login = compiler.generate({
                        title : "Log In",
                        center : true,
                        type : "call_to_action"
                    })
                    .then((element)=>{
                        dom.querySelector(".template_button-submit.template_login").appendChild(element);
                    })

                var promise_signup = compiler.generate({
                        title : "Sign Up",
                        center : true,
                        type : "call_to_action"
                    })
                    .then((element)=>{
                        dom.querySelector(".template_button-submit.template_signup").appendChild(element);
                    })

                var promise_switch_signup = compiler.generate({
                        title : "Log In, Instead",
                        center : true,
                        type : "basic"
                    })
                    .then((element)=>{
                        dom.querySelector(".template_button-switch.template_signup").appendChild(element);
                    })

                var promise_switch_login = compiler.generate({
                        title : "Sign Up, Instead",
                        center : true,
                        type : "basic"
                    })
                    .then((element)=>{
                        dom.querySelector(".template_button-switch.template_login").appendChild(element);
                    })

                return Promise.all([promise_login, promise_signup, promise_switch_signup. promise_switch_login])
            })

        var promise_all_inputs = view_loader.load("clientside-view-input-text")
            .then((compiler)=>{

                var promise_email = compiler.generate({
                        label : "Email",
                        required : true,
                    })
                    .then((element)=>{
                        dom.querySelector(".template_input-email").appendChild(element);
                    })

                var promise_password = compiler.generate({
                        label : "Password",
                        password : true,
                        required : true,
                    })
                    .then((element)=>{
                        dom.querySelector(".template_input-password").appendChild(element);
                    })

                return Promise.all([promise_email, promise_password])
            })

        var promise_ui_rendered = Promise.all([promise_all_buttons, promise_all_inputs]);



        /*
            ui dependent definitions ---------------------------------------------------------------------
        */
        // append toggle functionality to toggle buttons
        var promise_toggle_appended = promise_ui_rendered
            .then(()=>{
                dom.querySelector(".template_button-switch.template_login").onclick = ()=>{dom.handler.show("signup")}
                dom.querySelector(".template_button-switch.template_signup").onclick = ()=>{dom.handler.show("login")}
            })


        // append convinient element references
        var promise_submission_buttons_reference = promise_ui_rendered
            .then(()=>{
                dom.submission_button = {
                    login : dom.querySelector(".template_button-submit.template_login"),
                    signup : dom.querySelector(".template_button-submit.template_signup"),
                }
            })

        // define input extraction logic
        var promise_extraction_logic = promise_ui_rendered
            .then(()=>{
                // assign extraction logic (i.e., enable retreiving password and email from template)
                dom.extract = {
                    email: function(){
                        return dom.querySelector(".template_input-email").querySelector("input").value
                    },
                    password: function(){
                        return dom.querySelector(".template_input-password").querySelector("input").value
                    },
                }
            })



        /*
            append overall view handlers ---------------------------------------------------------------------
        */
        dom.handler = {
            show : function(which){
                this.hide_both();
                this.show_part(which);
                dom.style.display = "flex";
            },
            hide : function(){
                dom.style.display = "none";
            },
            show_part : function(which){
                if(which == "login"){
                    var part_class = ".template_login";
                } else if (which == "signup"){
                    var part_class = ".template_signup";
                } else {
                    console.error("Invalid part requested to be displayed from signup_login template. error.");
                    return;
                }
                dom.querySelectorAll(part_class)
                    .forEach((e)=>{
                        e.style.display = "inherit"
                    })
            },
            hide_both : function(){
                dom.querySelectorAll(".template_signup, .template_login")
                    .forEach((e)=>{
                        e.style.display = "none"
                    })
            }
        }
        dom.show = function(which){return dom.handler.show(which)};
        dom.hide = function(){return dom.handler.hide()};


        /*
            define when modal is completed
        */
        var promise_ready_to_display = Promise.all([promise_all_buttons, promise_all_inputs, promise_toggle_appended, promise_submission_buttons_reference, promise_extraction_logic])
            .then(()=>{return dom})

        return promise_ready_to_display;
    }
}
