function drawLoginTemplate(){
    return (`
    <div class="panel pnl-login-signup" id="login-panel">
        <h3 class="text-center">Login <i class="ion-log-in"></i></h3>
        <form action="/auth/login" method="get">
        <div class="form-group">
            <label for="login-username">User Name</label>
            <input class="form-control" id="login-username" type="text" placeholder="username" name="username" required>
        </div>
        <div class="form-group">
            <label for="login-password">Password</label>
            <input class="form-control" id="login-password" type="password" placeholder="password" name="password" required>
        </div>
        <button type="submit" class="btn btn-success" > Submit <i class="ion-checkmark-round"></i></button>
        <!--<button class="btn btn-success" onclick="submitLogin()"> Submit <i class="ion-checkmark-round"></i></button>-->
        <small>Not registered yet? You can sign up 
            <span class="link-login-signup" onclick="showSignup()">here</span>
        </small>
        </form>
    </div>
    `)
}

function drawSignupTemplate() {
    return (`
        <div class="panel pnl-login-signup" id="signup-panel">
            <h3 class="text-center">Signup <i class="ion-person-add"></i></h3>
            <form action="/auth/signup" method="get">
            <div class="form-group">
                <label for="signup-username">User Name</label>
                <input class="form-control" id="signup-username" type="text" placeholder="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="signup-password">Password</label>
                <input class="form-control" id="signup-password" type="password" placeholder="password" name="password" required>
            </div>
            <button type="submit" class="btn btn-success"> Submit <i class="ion-checkmark-round"></i></button>
           <!-- <button class="btn btn-success" onclick="submitSignup()"> Submit <i class="ion-checkmark-round"></i></button>-->
            <small>Already registered? You can login 
                <span class="link-login-signup" onclick="showLogin()">here</span>
            </small>
            </form>
        </div>
    `)   
}

function showSignup() {
    if (document.querySelector("#signup-panel")) {
        document.querySelector("#login-form-holder").innerHTML = ""        
    } else {
        var signupTpl = drawSignupTemplate()
        document.querySelector("#login-form-holder").innerHTML = signupTpl
    }
}

function showLogin() {
    if (document.querySelector("#login-panel")) {
        document.querySelector("#login-form-holder").innerHTML = ""        
    } else {
        var loginTpl = drawLoginTemplate()
        document.querySelector("#login-form-holder").innerHTML = loginTpl
    }
}