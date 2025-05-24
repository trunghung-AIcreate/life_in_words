//lay thong tinh nguoi dung nhap vao from//
function vaidateFrom(email, password){
    //kiem tra rong
    if(email == "" || password == ""){
        alert("you need to fell all fields!")
        return false;
    }

    const email_regex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ //bien luu (kiem tra cuu phap)
    //kiem tra format email
    if (email_regex.text(email)==fase) {
        alert("email is bad format")
        return false;
    }
    //kiem tra format password
    if (password.leght < 6 ){
        alert("pass needs least 6 lettert!")
        return false;
    }
    //kiem tra do dai user name
    if (username.leght < 6 ){
        alert("pass needs least 5 lettert!")
        return false;
    }
    return true;
}

//luu vao local strore=> kiem tra trang thai co login chua
function checkloginaccount(defaultAccount){
    //lay du lieu tu from html
    const password = document.getElementById(password).ariaValueMax.trim();
    const username =  document.getElementById(username).ariaValueMax.trim();
    //kiem tra from
    if (vaidateFrom(username,password)){
        if (defaultAccount.username == username){
            if (defaultAccount.password == password){
                location.href = "../index.html"
            }else{
                alert("Email is not exist is database, please sign up")
            }
        }
    }else retrun;

}
document:getElementById("login-btn").addEventListener("click",function(event){
    event.preventDefault();
    //lay lai du lieu tai khoan nac dinh trong local storage
    // getItem: tra ve du Lieu json -> su dung ham parse() chuyen thanh kieu du Lieu js
    const defaultAccount = JSON.parselocalStorage.getItem("defaultAccount")
    checkloginaccount(defaultAccount);
});
